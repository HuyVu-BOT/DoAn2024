import React, { useEffect, useState } from "react";
import { Project, ProjectType } from "@models/project";
import { Button, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import request from "@lib/api";

// eslint-disable-next-line import/no-extraneous-dependencies
import "react-tagsinput/react-tagsinput.css";

export default function ProjectForm(props) {
  const {
    projectInput,
    showWaitingModal,
    handleSubmit,
    setProject,
    isUpdating,
    originalProject,
  } = props;
  const router = useRouter();
  const [availableDatasets, setAvailableDataset] = useState<Array<string>>([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProject((values) => {
      if (name === "proj_type") {
        values._id = originalProject ? originalProject._id : "";
      }
      return { ...values, [name]: value };
    });
  };

  const getAvailableDatasets = async () => {
    const res = await request("GET", `available_reid_datasets`, router, null);
    if (res && res.status === 200) {
      const datasets = res.data.datasets;
      setAvailableDataset(datasets);
      if (datasets.length > 0) {
        let newProjectInput = { ...projectInput };
        newProjectInput._id = datasets[0];
        setProject(newProjectInput);
      }
    }
  };

  useEffect(() => {
    if (projectInput.proj_type === ProjectType.REID) getAvailableDatasets();
  }, [projectInput.proj_type]);

  return (
    <>
      <div className="row">
        <div className="col-3">
          <Button
            variant="outline-secondary"
            className="mb-2"
            onClick={() => {
              router.back();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Go Back
          </Button>
        </div>
        <div className="col-6">
          <h3>{isUpdating ? "Update project" : "Create new project"}</h3>
          <Form onSubmit={handleSubmit}>
            {/* <Tabs>
            <Tab eventKey="general" title="General Information" className="p-3"> */}
            <Form.Group className="mb-3">
              <Form.Label>Project name</Form.Label>
              <Form.Control
                name="name"
                type="text"
                required
                placeholder="AWLVN Project"
                value={projectInput.name || ""}
                disabled={showWaitingModal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Type</Form.Label>
              {originalProject ? (
                <Form.Select
                  name="proj_type"
                  defaultValue={originalProject.proj_type}
                >
                  <option value={originalProject.proj_type}>
                    {originalProject.proj_type === ProjectType.ROI
                      ? "ROI"
                      : "REID"}
                  </option>
                </Form.Select>
              ) : (
                <Form.Select
                  name="proj_type"
                  defaultValue={"roi"}
                  onChange={handleChange}
                >
                  <option value="roi">ROI</option>
                  <option value="reid">REID</option>
                </Form.Select>
              )}
            </Form.Group>
            {originalProject && projectInput.proj_type === ProjectType.ROI && (
              <Form.Group className="mb-3">
                <Form.Label>Project ID</Form.Label>
                <Form.Control
                  name="_id"
                  type="text"
                  placeholder="l-prj6"
                  required
                  defaultValue={originalProject._id}
                />
              </Form.Group>
            )}
            {originalProject && projectInput.proj_type === ProjectType.REID && (
              <Form.Group className="mb-3">
                <Form.Label>Choose dataset</Form.Label>
                <Form.Select name="_id" defaultValue={originalProject._id}>
                  <option key={originalProject._id} value={originalProject._id}>
                    {originalProject._id}
                  </option>
                </Form.Select>
              </Form.Group>
            )}
            {!originalProject && projectInput.proj_type === ProjectType.ROI && (
              <Form.Group className="mb-3">
                <Form.Label>Project ID</Form.Label>
                <Form.Control
                  name="_id"
                  type="text"
                  placeholder="l-prj6"
                  required
                  value={projectInput._id || ""}
                  disabled={showWaitingModal}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
            {!originalProject &&
              projectInput.proj_type === ProjectType.REID && (
                <Form.Group className="mb-3">
                  <Form.Label>Choose dataset</Form.Label>
                  <Form.Select
                    name="_id"
                    // defaultValue={availableDatasets[0]}
                    defaultValue={projectInput._id || availableDatasets[0]}
                    onChange={handleChange}
                  >
                    {availableDatasets.length === 0 && (
                      <option>No available dataset</option>
                    )}
                    {availableDatasets.map((dataset) => {
                      return (
                        <option key={dataset} value={dataset}>
                          {dataset}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              )}
            <Form.Group className="mb-3">
              <Form.Label>Project description</Form.Label>
              <Form.Control
                name="description"
                as="textarea"
                disabled={showWaitingModal}
                value={projectInput.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={
                showWaitingModal ||
                (projectInput.proj_type === ProjectType.REID &&
                  availableDatasets.length === 0) ||
                !projectInput._id ||
                !projectInput.name
              }
            >
              Submit
            </Button>
          </Form>
        </div>
        <div className="col-3"></div>
      </div>
    </>
  );
}
