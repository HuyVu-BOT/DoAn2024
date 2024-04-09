import { ProjectsResponse } from "@models/response";
import { Card, Dropdown, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Project, ProjectType, ProjectTypeValues } from "@models/project";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import request from "@lib/api";
import { useRouter } from "next/router";
import { AlertObject, AlertTypes } from "@models/context";
import { AlertContext } from "@context";
import { ExportingREIDModal } from "@components/Modals";
import { ModalInfo, blankModalInfo } from "@models/modals";
import { ModalContext } from "@context";
import { Modal } from "react-bootstrap";

type ProjectProps = {
  project: Project;
  mutate: any;
  setSelectedID: Dispatch<SetStateAction<string>>;
};

function ProjectCard(props: ProjectProps) {
  const { project, mutate, setSelectedID } = props;
  const router = useRouter();
  const { alert, setAlert } = useContext<AlertObject>(AlertContext);
  const { modalInfo, setModalInfo } = useContext<{
    modalInfo: ModalInfo;
    setModalInfo: Dispatch<SetStateAction<ModalInfo>>;
  }>(ModalContext);

  const deleteProject = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (confirm(`Want to delete device(${project._id})?`)) {
      const res = await request(
        "DELETE",
        `projects/${project._id}`,
        router,
        null,
        setAlert,
        "Deleted project successfully."
      );
      if (res && res.status === 200) {
        mutate();
      }
    }
  };

  return (
    <>
      <div className="col-sm-4 col-lg-4 mb-3" style={{ maxWidth: "300px" }}>
        <Card
          bg={
            project.is_finished
              ? "secondary"
              : project.proj_type === ProjectType.REID
              ? "info"
              : "success"
          }
          text="white"
          className="mb-8 h-100"
        >
          <Card.Body className="pb-4 h-100 d-flex justify-content-center align-items-center">
            <div className="row w-100">
              <div className="col-10">
                <div className="fs-4 fw-semibold">
                  <Link
                    href={
                      project.proj_type === ProjectType.ROI
                        ? `/projects/${project._id}/devices`
                        : `/projects/${project._id}/sessions`
                    }
                    passHref
                    legacyBehavior
                  >
                    <span className="white-link">{project.name}</span>
                  </Link>
                </div>
                <div>
                  <span className="fs-6 ms-2 fw-normal">
                    {`(${project.proj_type})`}
                  </span>
                </div>
                {project.exported_to && project.exported_to.length > 0 && (
                  <div>
                    <span className="fs-6 ms-2 fw-normal">
                      {`Exported to: ${project.exported_to}`}
                    </span>
                  </div>
                )}
                {/* <div>{project.description}</div> */}
              </div>
              <Dropdown align="end" className="col-2">
                <Dropdown.Toggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
                  id="dropdown-chart2"
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href={`/projects/${project._id}/edit`}>
                    Edit
                  </Dropdown.Item>
                  {project.proj_type === ProjectType.REID && (
                    <>
                      <Dropdown.Item href={`/projects/${project._id}/sessions`}>
                        Sessions
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedID(project._id);
                          setModalInfo({ isShow: true, type: "exportREID" });
                        }}
                      >
                        Export/Exclude
                      </Dropdown.Item>
                    </>
                  )}
                  {project.proj_type === ProjectType.ROI && (
                    <>
                      <Dropdown.Item href={`/projects/${project._id}/devices`}>
                        Device list
                      </Dropdown.Item>
                      <Dropdown.Item href={`/projects/${project._id}/stores`}>
                        Store list
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Item href="#" onClick={deleteProject}>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default function ProjectList(props: any) {
  const { projects, mutate } = props;
  const router = useRouter();
  const { alert, setAlert } = useContext<AlertObject>(AlertContext);
  const [showWaitingModal, setShowWaitingModal] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<string>("");
  const [projectType, setProjectType] = useState<"all" | ProjectTypeValues>(
    "all"
  );

  const exportREIDdata = async (output_project_name: string) => {
    if (selectedID.length === 0) return;
    const data = {
      project_id: selectedID,
      output_name: output_project_name,
      is_exported: true,
    };
    const res = await request(
      "POST",
      `export_reid_data`,
      router,
      JSON.stringify(data),
      setAlert,
      "Export REID data successfully"
    );
    if (res && res.status === 200) {
      setShowWaitingModal(false);
      mutate();
    }
  };

  const exludeREIDdata = async (output_project_name: string) => {
    if (selectedID.length === 0) return;
    const data = {
      project_id: selectedID,
      output_name: output_project_name,
      is_exported: false,
    };
    const res = await request(
      "POST",
      `export_reid_data`,
      router,
      JSON.stringify(data),
      setAlert,
      "Exclude REID data successfully"
    );
    if (res && res.status === 200) {
      setShowWaitingModal(false);
      mutate();
    }
  };

  return (
    <>
      <div className="row">
        <div className="col text-center mb-3">
          Filter Project Type:{" "}
          <Form.Select
            defaultValue={"all"}
            className="d-inline-block w-auto"
            aria-label="Item per page"
            onChange={(event) => {
              setProjectType(event.target.value);
            }}
          >
            <option value={"all"}>All</option>
            <option value={ProjectType.REID}>REID</option>
            <option value={ProjectType.ROI}>ROI</option>
          </Form.Select>
        </div>
      </div>
      {projects
        .filter((project: Project) => {
          if (projectType === "all") {
            return true;
          } else {
            return project.proj_type === projectType;
          }
        })
        .map((project: Project) => (
          <ProjectCard
            key={project._id}
            project={project}
            mutate={mutate}
            setSelectedID={setSelectedID}
          />
        ))}
      <div className="col-sm-4 col-lg-2 mb-3">
        <Link href="/projects/create" passHref legacyBehavior>
          <Card bg="light" className="mb-4 h-100">
            <Card.Body className="pb-3 h-100 d-flex justify-content-center align-items-center">
              <FontAwesomeIcon fixedWidth icon={faPlus} className="fa-2x" />
            </Card.Body>
          </Card>
        </Link>
      </div>
      <ExportingREIDModal
        exportREIDdata={(output_project_name: string) => {
          setShowWaitingModal(true);
          exportREIDdata(output_project_name);
        }}
        exludeREIDdata={(output_project_name: string) => {
          setShowWaitingModal(true);
          exludeREIDdata(output_project_name);
        }}
        cancelExporting={() => {
          setAlert({
            show: true,
            type: AlertTypes.WARNING,
            message: "REID data has not been exported yet!",
          });
        }}
      />
      <Modal show={showWaitingModal}>
        <Modal.Body className="p-0">
          <p className="text-center pt-2 px-5 pb-1">
            Exporting/Excluding REID images is in progress. Please wait for a
            few dozen minutes...
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}
