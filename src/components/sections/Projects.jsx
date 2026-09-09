import { useState, useMemo } from 'react';
import { PiArrowUpRightBold, PiXBold, PiArrowSquareOutBold, PiGithubLogoBold } from 'react-icons/pi';
import { Button, IconButton, Dialog } from '../m3';
import { projects } from '../../data/projects';
import './Projects.css';

// Sixteen identical cards in a 3-up grid gave a hardware-assembly exercise the
// same visual weight as a production forecasting engine, and it was the single
// densest thing on the page. Now four spotlight projects get real case-study
// rows and the other twelve sit in a compact index underneath. Both open the
// same detail dialog, so nothing is lost, it is just ranked.
const Projects = () => {
  const [selected, setSelected] = useState(null);

  const [spotlight, rest] = useMemo(
    () => [projects.filter((p) => p.spotlight), projects.filter((p) => !p.spotlight)],
    []
  );

  const close = () => setSelected(null);

  return (
    <section id="projects" className="projects">
      <div className="section__container">
        <div className="section__header">
          <h2 className="m3-display-small section__title">Selected work</h2>
          <p className="m3-body-large section__subtitle">
            Four systems running in production. The full index follows.
          </p>
          <hr className="section__rule" />
        </div>

        <ol className="work">
          {spotlight.map((project, i) => (
            <li key={project.id} className="work__item">
              <button
                type="button"
                className="work__row"
                onClick={() => setSelected(project)}
                aria-label={`View details for ${project.title}`}
              >
                <span className="work__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="work__main">
                  <span className="m3-headline-medium work__title">{project.title}</span>
                  <span className="m3-body-medium work__desc">{project.description}</span>
                  <span className="work__stack">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="work__tech">{tech}</span>
                    ))}
                  </span>
                </span>

                <span className="work__arrow" aria-hidden="true">
                  <PiArrowUpRightBold size={20} />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="work-index">
          <h3 className="m3-title-medium work-index__heading">Everything else</h3>
          <ul className="work-index__list">
            {rest.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className="work-index__row"
                  onClick={() => setSelected(project)}
                  aria-label={`View details for ${project.title}`}
                >
                  <span className="work-index__title">{project.title}</span>
                  <span className="work-index__tech">{project.technologies[0]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contents render only when a project is selected. Rendered
          unconditionally, the closed dialog left an empty <h2> and a stray
          "Built with" <h3> in the document outline. */}
      <Dialog open={Boolean(selected)} onClose={close} ariaLabelledby="project-dialog-title">
        {selected && (
        <>
        <div className="m3-dialog__header">
          <h2 className="m3-headline-small" id="project-dialog-title">
            {selected.title}
          </h2>
          <IconButton onClick={close} aria-label="Close">
            <PiXBold size={18} />
          </IconButton>
        </div>

        <div className="m3-dialog__body">
          <p className="m3-body-large projects__dialog-desc">
            {selected.fullDescription || selected.description}
          </p>

          {selected.features?.length > 0 && (
            <div className="projects__dialog-block">
              <h3 className="m3-label-medium projects__dialog-label">What it does</h3>
              <ul className="projects__dialog-list">
                {selected.features.map((f) => (
                  <li key={f} className="m3-body-medium">{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="projects__dialog-block">
            <h3 className="m3-label-medium projects__dialog-label">Built with</h3>
            <p className="m3-body-medium projects__dialog-stack">
              {selected.technologies.join(', ')}
            </p>
          </div>

          {(selected.liveDemo || selected.github) && (
            <div className="projects__dialog-actions">
              {selected.liveDemo && (
                <Button
                  variant="filled"
                  startIcon={<PiArrowSquareOutBold />}
                  href={selected.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live site
                </Button>
              )}
              {selected.github && (
                <Button
                  variant="outlined"
                  startIcon={<PiGithubLogoBold />}
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </Button>
              )}
            </div>
          )}
        </div>
        </>
        )}
      </Dialog>
    </section>
  );
};

export default Projects;
