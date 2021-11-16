import { Form, Input, Modal } from "antd";

const CollectionCreateForm = ({
  visible,
  onCreate,
  onCancel,
  onSubmission,
  formName,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new post"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSubmission(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        id="base_form"
        name={formName}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 11 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={(event) => onSubmission(event)}
        form={form}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please put a title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please have post content!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
const BaseForm = ({ onCancelClick, formName, onSubmission, buttonClicked }) => {
  return (
    <CollectionCreateForm
      visible={buttonClicked}
      formName={formName}
      onSubmission={onSubmission}
      onCancel={onCancelClick}
    />
  );
};

export default BaseForm;
