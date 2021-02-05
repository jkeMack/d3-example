// 创建图例
function createLegend(g, color, position, offsetX, offsetY) {
    position = position || 'left';
    let transform;
    switch (position) {
        case "left":
            transform = (d, i) => `translate(0,${i * 25})`;
            break;
        case "right":
            transform = (d, i) => `translate(${offsetX},${i * 25})`;
            break;
        case "top":
            transform = (d, i) => `translate(${i * 50},0)`;
            break;
        case "bottom":
            transform = (d, i) => `translate(${i * 50},${offsetY})`;
            break;
    }
    let item = g.append("g").attr("class", "h-chart-pie-legend-item").attr("transform", transform);
    item.append("rect").attr("width", 10).attr("height", 10).attr("y", 0).attr("fill", d => color(d.name)).attr("class", "h-chart-pie-legend-item-rect");
    item.append("text").text(d => d.name).attr("x", 15).attr("y", 10).attr("class", "h-chart-pie-legend-item-title");
}

// 创建提示文字
function craeteTooltip() {
    return d3.select("body").append("div").attr("class", "h-chart-tooltip").style("opacity", 0);
}

// 创建x轴
function createXAxis(g, x, offsetY, data, option) {
    const { xAxis } = option;
    if (xAxis && xAxis.type === "value") {
        return g.attr('transform', `translate(0, ${offsetY})`)
            .call(d3.axisBottom(x).ticks().tickSizeOuter(0));
    } else {
        return g.attr('transform', `translate(0, ${offsetY})`)
            .call(d3.axisBottom(x).ticks().tickSizeOuter(0).tickFormat(i => data[i].name));
    }
}

// 创建y轴
function createYAxis(g, y, offsetX, data, option) {
    const { yAxis } = option;
    if (!yAxis || yAxis.type === "value") {
        return g.attr('transform', `translate(${offsetX},0)`)
            .call(d3.axisLeft(y).ticks().tickSizeOuter(0));
    } else {
        return g.attr('transform', `translate(${offsetX},0)`)
            .call(d3.axisLeft(y).ticks().tickSizeOuter(0).tickFormat(i => data[i].name));
    }
}

// 创建基础线形图
function createBasicLine(option) {
    const { height, width, margin, data } = option;
    const x = d3.scaleBand().domain(d3.range(data.length)).range([margin.left, width - margin.right]).padding(1);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height - margin.bottom, margin.top]);

    const svg = d3.select('body').append('svg')
        .attr('height', height)
        .attr('width', width);

    const chart = svg.append('g').attr("class", "h-chart");
    const gx = chart.append('g');
    const gy = chart.append('g');


    gx.call(createXAxis, x, height - margin.bottom, data, option);
    gy.call(createYAxis, y, margin.left, data, option);

    const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x((d, i) => x(i))
        .y(d => y(d.value));

    // 折线
    chart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    // 折线圆点
    chart.append('g').selectAll('circle').data(data).join('circle')
        .attr('cx', (d, i) => x(i))
        .attr('cy', d => y(d.value))
        .attr('r', 5)
        .attr('stroke', 'steelblue')
        .attr('fill', '#fff');
}

function createBasicBar(option) {
    const { height, width, margin, data, tooltipFormat, xAxis, yAxis } = option;
    let x, y;
    if (xAxis && xAxis.type === 'value') {
        x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([margin.left, width - margin.right]);
        y = d3.scaleBand().domain(d3.range(data.length)).range([margin.top, height - margin.bottom]).padding(0.3);
    } else {
        x = d3.scaleBand().domain(d3.range(data.length)).range([margin.left, width - margin.right]).padding(0.3);
        y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height - margin.bottom, margin.top]);
    }


    const svg = d3.select('body').append('svg')
        .attr('height', height)
        .attr('width', width);

    const chart = svg.append('g').attr("class", "h-chart");
    const gx = chart.append('g');
    const gy = chart.append('g');


    (xAxis && xAxis.show !== false) && gx.call(createXAxis, x, height - margin.bottom, data, option);
    (yAxis && yAxis.show !== false) && gy.call(createYAxis, y, margin.left, data, option);

    if (xAxis && xAxis.type === 'value') {
        chart.append('g').attr('fill', 'steelblue').selectAll('rect').data(data).enter().append('rect').attr("class", "h-chart-bar").transition().duration(500)
            .attr('x', d => x(0))
            .attr('y', (d, i) => y(i))
            .attr('height', y.bandwidth())
            .attr('width', d => x(d.value) - x(0));
    } else {
        chart.append('g').attr('fill', 'steelblue').selectAll('rect').data(data).enter().append('rect').attr("class", "h-chart-bar").transition().duration(500)
            .attr('x', (d, i) => x(i))
            .attr('y', d => y(d.value))
            .attr('height', d => y(0) - y(d.value))
            .attr('width', x.bandwidth());
    }

    let tooltip = craeteTooltip();
    d3.selectAll(".h-chart-bar").on("mouseover", function (e) {
        let data = e.target.__data__;
        tooltip.html(tooltipFormat ? tooltipFormat(data) : `${data.name}:${data.value}`).style("left",e.pageX + "px").style("top", (e.pageY + 5) + "px").style("opacity", 1);
    })
    d3.selectAll(".h-chart-bar").on("mouseout", function (e) {
        let data = e.target.__data__;
        tooltip.style("opacity", 0);
    })
}

function createBasicPie(option) {
    const { height, width, innerRadius, outerRadius, data, tooltipFormat, legend } = option;
    let margin = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    let pieWidth = width, pieHeight = height;
    if (legend && legend.show) {
        // 如果是在左右，那么就需要留出宽度，如果是上下那么就需要留出高度
        margin[legend.position] = legend.width || legend.height || 0;
        // 需要重置绘制饼图的宽度和高度
        pieWidth -= (legend.width || 0);
        pieHeight -= (legend.height || 0);
    }


    const radius = Math.min(pieWidth, pieHeight) / 2;

    let arc = d3.arc().innerRadius(radius * innerRadius).outerRadius(radius * outerRadius);
    let pie = d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.value);
    let color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    const svg = d3.select('body').append('svg')
        .attr('height', height)
        .attr('width', width);
    // 根据图例的位置，设置饼图的偏移量
    const chart = svg.append('g')
        .attr("transform", d => `translate(${(pieWidth / 2) + (legend.position === 'left' ? margin.left : 0)},${(pieHeight / 2) + (legend.position === 'top' ? margin.top : 0)})`)
        .attr("class", "h-chart");
    const arcs = pie(data);

    chart.selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .attr("class", "h-chart-arc");

    chart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));

    // 默认不显示图例，只有配置里面设置显示图例的时候才显示
    if(legend && legend.show){
        let legendBox;
        let position = legend && legend.position? legend.position: "left";
        switch(position){
            case "left":
                legendBox = svg.append("g").attr("class", "h-chart-pie-legend");
                break;
            case "right":
                legendBox = svg.append("g").attr("x",pieWidth).attr("class", "h-chart-pie-legend");
                break;
            case "top":
                legendBox = svg.append("g").attr("class", "h-chart-pie-legend");
                break;
            case "bottom":
                legendBox = svg.append("g").attr("y", pieHeight).attr("class", "h-chart-pie-legend");
                break;
        }

        legendBox.selectAll("g").data(data).enter().call(createLegend, color, legend.position, pieWidth, pieHeight);
        // 获取图例包含框实际撑开的高度和宽度
        let legendHeight = legendBox.node().getBBox().height;
        let legendWidth = legendBox.node().getBBox().width;
        if(position === 'left' || position === 'right'){
            legendBox.attr("transform", `translate(0, ${(height - legendHeight)/2})`);
        }else{
            legendBox.attr("transform", `translate(${(width - legendWidth)/2}, ${(legend.height - legendHeight)/2})`);
        }
    }

    let tooltip = craeteTooltip();
    d3.selectAll(".h-chart-arc").on("mouseover", function (e) {
        let data = e.target.__data__.data;
        tooltip.html(tooltipFormat ? tooltipFormat(data) : `${data.name}:${data.value}`).style("left", e.pageX + "px").style("top", (e.pageY + 5) + "px").style("opacity", 1);
    })
    d3.selectAll(".h-chart-arc").on("mouseout", function (e) {
        tooltip.style("opacity", 0);
    })
}