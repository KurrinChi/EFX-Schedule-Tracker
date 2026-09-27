import { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

function getGreeting(hour) {
  if (hour >= 1 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

function getDateTime() {
  const now = new Date();

  return {
    greeting: getGreeting(now.getHours()),
    date: now.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

function getFirstName(user) {
  const fullName =
    user?.fullName || user?.FullName || user?.name || user?.Name || "";

  return fullName.trim().split(/\s+/)[0] || "there";
}

export default function PageHeader({ onAdd }) {
  const { user } = useAuth();
  const [dateTime, setDateTime] = useState(getDateTime);

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(getDateTime());
    };

    // Update immediately in case the component has been mounted
    // across a minute/hour/date boundary.
    updateDateTime();

    // Keep the displayed greeting/date synchronized with the
    // device's local time without requiring a page refresh.
    const interval = window.setInterval(updateDateTime, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const firstName = getFirstName(user);

  return (
    <div className="page-header">
      <div>
        <Typography.Text className="eyebrow">{dateTime.date}</Typography.Text>

        <h1>
          {dateTime.greeting}, {firstName}.
        </h1>

        <p>Here is what is happening across your productions.</p>
      </div>

      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        New project
      </Button>
    </div>
  );
}
