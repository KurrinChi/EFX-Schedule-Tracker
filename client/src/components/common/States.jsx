import { Alert, Empty, Spin } from "antd";
export function LoadingState() {
  return (
    <div className="table-state">
      <Spin size="large" />
    </div>
  );
}
export function EmptyState({ description = "No projects found" }) {
  return (
    <div className="table-state">
      <Empty description={description} />
    </div>
  );
}
export function ErrorState({ message = "Unable to load this data." }) {
  return (
    <Alert
      type="error"
      showIcon
      title="Something went wrong"
      description={message}
    />
  );
}
