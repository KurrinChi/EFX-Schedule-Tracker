import { useEffect, useState } from "react";
import AppLayoutComponent from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";
import StatCards from "../components/dashboard/StatCards";
import Charts from "../components/dashboard/Charts";
import ProjectTable from "../components/projects/ProjectTable";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import EntityModal from "../components/entities/EntityModal";
import {
  ReportFilterModal,
  ReportPreviewModal,
} from "../components/reports/ReportModals";
import { projectService } from "../services/projectService";
import { clientService } from "../services/clientService";
import { packageService } from "../services/packageService";
import { serviceService } from "../services/serviceService";
import { LoadingState, ErrorState } from "../components/common/States";
import { message } from "antd";
import { reportService } from "../services/reportService";
export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [entity, setEntity] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState();
  const [payment, setPayment] = useState();
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([
      projectService.list(),
      clientService.getClients(),
      packageService.getPackages(),
      serviceService.getServices(),
    ])
      .then(([p, c, pk, s]) => {
        setProjects(p);
        setClients(c);
        setPackages(pk);
        setServices(s);
      })
      .catch(() => setError("Unable to load workspace data."))
      .finally(() => setLoading(false));
  }, []);
  const saveProject = async (values) => {
    setSaving(true);
    try {
      const saved = editing
        ? await projectService.update(editing.id, values)
        : await projectService.create(values);
      if (editing)
        setProjects((items) =>
          items.map((item) => (item.id === editing.id ? saved : item)),
        );
      else setProjects((items) => [saved, ...items]);
      setFormOpen(false);
      setEditing(null);
      message.success(editing ? "Project updated" : "Project created");
    } catch {
      message.error("Unable to save the project. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const deleteProject = async (project) => {
    try {
      await projectService.remove(project.id);
      setProjects((items) => items.filter((item) => item.id !== project.id));
      message.success("Project deleted");
    } catch {
      message.error("Unable to delete the project.");
    }
  };
  const addEntity = async (values) => {
    try {
      const result =
        entity === "client"
          ? await clientService.createClient(values)
          : entity === "package"
            ? await packageService.createPackage(values)
            : await serviceService.createService(values);
      if (entity === "client") setClients((items) => [result, ...items]);
      if (entity === "package") setPackages((items) => [result, ...items]);
      if (entity === "service") setServices((items) => [result, ...items]);
      setEntity(null);
      message.success(`${entity} created`);
    } catch {
      message.error(`Unable to create the ${entity}.`);
    }
  };
  if (loading)
    return (
      <AppLayoutComponent search={search} setSearch={setSearch}>
        <LoadingState />
      </AppLayoutComponent>
    );
  if (error)
    return (
      <AppLayoutComponent search={search} setSearch={setSearch}>
        <ErrorState message={error} />
      </AppLayoutComponent>
    );
  return (
    <AppLayoutComponent
      onAddEntity={(type) =>
        type === "project" ? setFormOpen(true) : setEntity(type)
      }
      onReport={() => setReportOpen(true)}
      search={search}
      setSearch={setSearch}
    >
      <PageHeader
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />
      <StatCards projects={projects} />
      <Charts projects={projects} />
      <ProjectTable
        projects={projects}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        payment={payment}
        setPayment={setPayment}
        onView={(p) => message.info(`${p.projectType} for ${p.clientName}`)}
        onEdit={(p) => {
          setEditing(p);
          setFormOpen(true);
        }}
        onDelete={(p) => deleteProject(p)}
      />
      <ProjectFormModal
        open={formOpen}
        project={editing}
        clients={clients}
        packages={packages}
        services={services}
        onCancel={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={saveProject}
        submitting={saving}
      />
      <EntityModal
        type={entity}
        open={Boolean(entity)}
        onCancel={() => setEntity(null)}
        onSubmit={addEntity}
      />
      <ReportFilterModal
        open={reportOpen}
        onCancel={() => setReportOpen(false)}
        clients={clients}
        packages={packages}
        onGenerate={async (filters) => {
          setReportLoading(true);
          try {
            const dateRange = filters.dateRange?.map((value) =>
              value.format("YYYY-MM-DD"),
            );
            const projectsForReport = await reportService.getProjectReport({
              ...filters,
              dateRange,
            });
            setReport({
              projects: projectsForReport,
              period: dateRange
                ? `${dateRange[0]} - ${dateRange[1]}`
                : "All scheduled projects",
              preparedBy: "Alex Morgan",
              title: filters.reportType || "Production overview",
            });
            setReportOpen(false);
          } catch {
            message.error("Unable to generate the report.");
          } finally {
            setReportLoading(false);
          }
        }}
      />
      <ReportPreviewModal
        open={Boolean(report)}
        report={report}
        onCancel={() => setReport(null)}
      />
    </AppLayoutComponent>
  );
}
