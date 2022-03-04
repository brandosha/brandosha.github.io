const projectsEl = document.getElementById("projects")

function makeEl(parent, tag, className, options) {
  const el = document.createElement(tag)
  el.className = className || ""
  parent.appendChild(el)

  if (options) {
    for (const key in options) {
      el[key] = options[key]
    }
  }

  return el
}

fetch("projects.md").then(res => res.text()).then(projectsMarkdown => {
  const projects = projectsMarkdown.split("\n## ").slice(1)
  console.log(projects)

  const codeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="currentColor" class="bi bi-file-code" viewBox="0 0 16 16">
  <path d="M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0a.5.5 0 1 0-.708.708L10.293 8 8.646 9.646a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z"/>
  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
</svg>`

  const projectIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="currentColor" class="bi bi-file-code" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"></path>
  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"></path>
</svg>`

  const inspirationIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
</svg>`

  projects.forEach(project => {
    const lines = project.split("\n")

    const outerProjectEl = makeEl(projectsEl, "div", "project")
    const projectEl = makeEl(outerProjectEl, "div", "project-body")

    const dateEl = makeEl(projectEl, "div", "project-date")
    const titleEl = makeEl(projectEl, "h2", "project-title")
    const descriptionEl = makeEl(projectEl, "p", "project-description")

    const tagsEl = makeEl(projectEl, "div", "project-tags")

    const tags = project.match(/`.+?`/g)
    if (tags) {
      tags.forEach(tag => {
        tag = tag.slice(1, -1)
        makeEl(tagsEl, "div", "project-tag", {
          innerText: tag
        })
      })
    }

    const linksEl = makeEl(projectEl, "div", "project-links")

    const inspirationLink = project.match(/\[Inspiration\]\((.*)\)/)
    if (inspirationLink) {
      const linkEl = makeEl(linksEl, "a", "project-icon", {
        title: "Inspiration",
        target: "_BLANK",
        href: inspirationLink[1]
      })
      linkEl.innerHTML = inspirationIcon
    }

    const codeLink = project.match(/\[Code\]\((.*)\)/)
    if (codeLink) {
      const linkEl = makeEl(linksEl, "a", "project-icon", {
        title: "Code",
        target: "_BLANK",
        href: codeLink[1]
      })
      linkEl.innerHTML = codeIcon
      linkEl.style.marginLeft = ".45em"
    }

    const projectLink = project.match(/\[(Project Site|Demo)\]\((.*)\)/)
    if (projectLink) {
      const linkEl = makeEl(linksEl, "a", "project-icon", {
        title: projectLink[1],
        target: "_BLANK",
        href: projectLink[2]
      })
      linkEl.innerHTML = projectIcon
    }

    dateEl.innerText = lines[1].slice(7)
    titleEl.innerText = lines[0]
    descriptionEl.innerText = lines[3]
  })
})