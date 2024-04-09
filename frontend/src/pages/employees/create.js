import type { NextPage } from "next";
import React, { SyntheticEvent, useContext, useState } from "react";

import { AdminLayout } from "@layout";

import { ProjectForm } from "@components/Project";
import request from "@lib/api";
import { useRouter } from "next/router";
import { AlertObject } from "@models/context";
import { AlertContext } from "@context";
import { Project, blankProject, ProjectType } from "@models/project";
import { Modal } from "react-bootstrap";

const Create: NextPage = () => {
  const [project, setProject] = useState<Project>({
    ...blankProject,
  });
  const { alert, setAlert } = useContext<AlertObject>(AlertContext);

  const router = useRouter();

  const [showWaitingModal, setShowWaitingModal] = useState<boolean>(false);

  const createProject = async (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowWaitingModal(true);
    project.id = project._id;
    const res = await request(
      "POST",
      "projects",
      router,
      project,
      setAlert,
      "Created project successful.",
      "/"
    );
    if (res && res.status === 200) {
      setProject({
        ...blankProject,
      });
    }
    setShowWaitingModal(false);
  };

  return (
    <AdminLayout>
      <ProjectForm
        projectInput={project}
        handleSubmit={createProject}
        showWaitingModal={showWaitingModal}
        setProject={setProject}
        isUpdating={false}
      />
      <Modal show={showWaitingModal}>
        <Modal.Body className="p-0">
          <p className="text-center pt-2 px-5 pb-1">
            {project.proj_type === ProjectType.REID
              ? "Importing images is in progress. Please wait for a few minutes..."
              : "Creating new project..."}
          </p>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default Create;
