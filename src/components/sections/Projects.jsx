import { useState } from 'react';
import { FiCode, FiExternalLink, FiX, FiGithub } from 'react-icons/fi';
import { Card, Chip, Button, IconButton, Dialog } from '../m3';
import { projects } from '../../data/projects';
import './Projects.css';

const Projects = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpen = (project) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="projects">
      <div className="section__container">
        <div className="section__header">
          <h2 className="m3-display-small section__title projects__title">Featured Projects</h2>
          <p className="m3-body-large section__subtitle">
            A selection of projects showcasing my technical skills and problem-solving abilities
          </p>
        </div>

        <div className="projects__grid">
          {projects.map((project) => (
            <Card
              key={project.id}
              variant="elevated"
              interactive
              className="projects__card"
              as="article"
              onClick={() => handleOpen(project)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpen(project)}
            >
              <div className="m3-card__content projects__card-content">
                <div className="projects__card-header">
                  <FiCode size={22} color="var(--md-sys-color-primary)" />
                  <p className="m3-title-medium projects__card-title">{project.title}</p>
                </div>
                <p className="m3-body-medium projects__card-desc">{project.description}</p>
                <div className="projects__card-chips">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <Chip key={i} label={tech} variant="assist" selected />
                  ))}
                  {project.technologies.length > 3 && (
                    <Chip label={`+${project.technologies.length - 3}`} variant="assist" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={openModal} onClose={handleClose} ariaLabel="Project details">
        <div className="m3-dialog__header">
          <div className="projects__modal-title-row">
            <FiCode size={24} color="var(--md-sys-color-primary)" />
            <h2 className="m3-headline-small" id="project-modal-title">
              {selectedProject?.title}
            </h2>
          </div>
          <IconButton onClick={handleClose} aria-label="Close">
            <FiX size={20} />
          </IconButton>
        </div>

        <div className="m3-dialog__body">
          {selectedProject?.image && (
            <div className="projects__modal-image">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <p className="m3-body-large projects__modal-desc">
            {selectedProject?.fullDescription || selectedProject?.description}
          </p>

          {selectedProject?.features?.length > 0 && (
            <div className="projects__modal-section">
              <p className="m3-title-medium projects__modal-section-title">Key Features</p>
              <ul className="projects__modal-list">
                {selectedProject.features.map((f, i) => (
                  <li key={i} className="m3-body-medium">{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="projects__modal-section">
            <p className="m3-title-medium projects__modal-section-title">Technologies Used</p>
            <div className="projects__modal-chips">
              {selectedProject?.technologies.map((tech, i) => (
                <Chip key={i} label={tech} variant="assist" selected />
              ))}
            </div>
          </div>

          <div className="projects__modal-actions">
            {selectedProject?.liveUrl && (
              <Button
                variant="filled"
                startIcon={<FiExternalLink />}
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </Button>
            )}
            {selectedProject?.githubUrl && (
              <Button
                variant="outlined"
                startIcon={<FiGithub />}
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Code
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </section>
  );
};

export default Projects;
