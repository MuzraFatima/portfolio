import type { PipelineStage, Project } from '@/types/content';

/** Turns "Label: detail" architecture lines into diagram stages when a project has no explicit pipeline. */
export function pipelineOf(project: Project): PipelineStage[] {
  if (project.deepDive) return project.deepDive.pipeline;
  return project.architecture.map((line) => {
    const i = line.indexOf(':');
    return i > 0
      ? { label: line.slice(0, i), detail: line.slice(i + 1).trim() }
      : { label: line, detail: '' };
  });
}
