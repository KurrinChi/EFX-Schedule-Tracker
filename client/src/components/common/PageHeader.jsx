import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
export default function PageHeader({ onAdd }) {
  return (
    <div className="page-header">
      <div>
        <Typography.Text className="eyebrow">
          THURSDAY, 24 SEPTEMBER 2026
        </Typography.Text>
        <h1>Good morning, Alex.</h1>
        <p>Here is what is happening across your productions.</p>
      </div>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        New project
      </Button>
    </div>
  );
}
