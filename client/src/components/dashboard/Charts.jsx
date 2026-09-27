import { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { Pie, Line } from "@ant-design/plots";

export default function Charts({ projects }) {
  const [isDark, setIsDark] = useState(
    document.documentElement.dataset.theme !== "light",
  );

  // Detect theme changes made by PreferenceContext / theme settings.
  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      setIsDark(root.dataset.theme !== "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const secondaryTextColor = isDark ? "#b8b8b8" : "#525252";
  const gridColor = isDark ? "#2a2a2a" : "#e2e5e9";

  const status = ["Upcoming", "Confirmed", "In Progress", "Completed"]
    .map((name) => ({
      name,
      value: projects.filter((p) => p.status === name).length,
    }))
    .filter((item) => item.value);

  const activity = [
    { month: "May", projects: 3 },
    { month: "Jun", projects: 5 },
    { month: "Jul", projects: 4 },
    { month: "Aug", projects: 7 },
    { month: "Sep", projects: projects.length },
  ];

  /*
   * Ant Design Charts has its own theme system.
   * We explicitly tell it whether the dashboard is dark or light
   * instead of allowing the chart to default to the light theme.
   */
  const chartTheme = {
    type: isDark ? "dark" : "light",

    axis: {
      labelFill: secondaryTextColor,
      lineStroke: gridColor,
      tickStroke: gridColor,
      gridStroke: gridColor,
    },

    legend: {
      itemLabelFill: secondaryTextColor,
    },
  };

  return (
    <Row gutter={[16, 16]} className="chart-grid">
      {/* PROJECT STATUS */}
      <Col xs={24} lg={9}>
        <Card
          title="Project status"
          extra={<span className="card-kicker">LIVE SNAPSHOT</span>}
        >
          <Pie
            data={status}
            angleField="value"
            colorField="name"
            radius={0.82}
            innerRadius={0.62}
            height={230}
            theme={chartTheme}
            legend={{
              color: {
                position: "bottom",
                itemLabelFill: secondaryTextColor,
                itemLabelFontSize: 13,
              },
            }}
            color={["#2f80ed", "#16c7c7", "#f28c52", "#c678f0"]}
            label={false}
          />
        </Card>
      </Col>

      {/* PROJECT ACTIVITY */}
      <Col xs={24} lg={15}>
        <Card
          title="Project activity"
          extra={<span className="card-kicker">LAST 5 MONTHS</span>}
        >
          <Line
            data={activity}
            xField="month"
            yField="projects"
            height={230}
            smooth
            theme={chartTheme}
            color="#2f80ed"
            axis={{
              x: {
                labelFill: secondaryTextColor,
              },
              y: {
                labelFill: secondaryTextColor,
              },
            }}
            point={{
              size: 4,
              shape: "circle",
              style: {
                fill: "#ff8a00",
                stroke: isDark ? "#111111" : "#ffffff",
                lineWidth: 2,
              },
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
