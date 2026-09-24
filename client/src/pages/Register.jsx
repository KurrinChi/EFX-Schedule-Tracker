import { useMemo, useState } from "react";
import { Alert, Button, Form, Input, Progress, Typography } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const requirements = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Number", test: (v) => /\d/.test(v) },
  { label: "Special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const score = useMemo(
    () => requirements.filter(({ test }) => test(password)).length,
    [password],
  );
  const onFinish = async (values) => {
    setSubmitting(true);
    setError("");
    try {
      await register(values);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="auth-page">
      <section className="auth-brand">
        <div className="brand-mark">
          EFX<span>CREATIONS</span>
        </div>
        <div className="brand-copy">
          <Typography.Text>JOIN THE COLLECTIVE</Typography.Text>
          <h1>
            Your next story
            <br />
            <em>starts here.</em>
          </h1>
          <p>
            Build a calmer, clearer production workflow from first contact to
            final delivery.
          </p>
        </div>
        <div className="auth-orbit">EFX / 02</div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <Link to="/login" className="back-link">
            <ArrowLeftOutlined /> Back to sign in
          </Link>
          <Typography.Text className="eyebrow">NEW WORKSPACE</Typography.Text>
          <h2>Create your account</h2>
          <p className="auth-subtitle">
            Set up your EFX Creations profile in a minute.
          </p>
          {error && (
            <Alert title={error} type="error" showIcon className="form-alert" />
          )}
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="Full name"
              name="fullName"
              rules={[{ required: true, message: "Enter your full name." }]}
            >
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Enter a valid email.",
                },
              ]}
            >
              <Input size="large" prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  min: 3,
                  message: "Use at least 3 characters.",
                },
              ]}
            >
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Create a password." }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Item>
            <div className="password-meter">
              <Progress
                percent={score * 20}
                showInfo={false}
                strokeColor={
                  score < 3 ? "#ff453a" : score < 5 ? "#ff8a00" : "#35c759"
                }
              />
              <span>
                {score < 3
                  ? "Needs work"
                  : score < 5
                    ? "Getting stronger"
                    : "Strong password"}
              </span>
            </div>
            <div className="requirements">
              {requirements.map(({ label, test }) => (
                <span className={test(password) ? "met" : ""} key={label}>
                  <CheckCircleOutlined /> {label}
                </span>
              ))}
            </div>
            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm your password." },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return !value || getFieldValue("password") === value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Passwords do not match."));
                  },
                }),
              ]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} />
            </Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              loading={submitting}
              icon={<ArrowRightOutlined />}
            >
              Create account
            </Button>
          </Form>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
