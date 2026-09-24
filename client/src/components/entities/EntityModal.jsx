import { Form, Input, InputNumber, Modal } from "antd";
export default function EntityModal({ type, open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const labels = { client: "Client", package: "Package", service: "Service" };
  const entity = labels[type];
  return (
    <Modal
      open={open}
      title={`Add ${entity || "entity"}`}
      okText={`Create ${entity || "entity"}`}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
      >
        {type === "client" && (
          <>
            <Form.Item
              name="fullName"
              label="Full name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="contactNumber" label="Contact number">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
          </>
        )}
        {type !== "client" && (
          <>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
