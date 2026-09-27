import { useState } from "react";
import { Alert, Button, Checkbox, Form, Input, Typography } from "antd";
import {
  ArrowRightOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const onFinish = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      await login(values);
      navigate("/dashboard");
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
          <Typography.Text>PHOTO + FILM PRODUCTION</Typography.Text>
          <h1>
            Make every frame
            <br />
            <em>matter.</em>
          </h1>
          <p>
            A focused workspace for the moments, stories, and people behind
            every EFX production.
          </p>
        </div>
        <div className="auth-orbit">EFX / 01</div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand brand-mark">
            EFX<span>CREATIONS</span>
          </div>
          <Typography.Text className="eyebrow">WELCOME BACK</Typography.Text>
          <h2>Sign in to your workspace</h2>
          <p className="auth-subtitle">
            Manage your schedule and keep production moving.
          </p>
          {error && (
            <Alert title={error} type="error" showIcon className="form-alert" />
          )}
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="Email or username"
              name="identifier"
              rules={[
                { required: true, message: "Enter your email or username." },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@efxcreations.com"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter your password." }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>
            <div className="form-options">
              <Checkbox>Remember me</Checkbox>
              <a href="#forgot">Forgot password?</a>
            </div>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              loading={submitting}
              icon={<ArrowRightOutlined />}
            >
              Sign in
            </Button>
          </Form>
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
          <div className="mock-note">
            SECURE SIGN-IN
            <br />
            Use your EFX workspace credentials.
          </div>
        </div>
      </section>
    </main>
  );
}
