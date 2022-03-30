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

var projects

fetch("projects.md").then(res => res.text()).then(projectsMarkdown => {
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

  const projectStrings = projectsMarkdown.split("\n## ").slice(1)
  projects = projectStrings.map(projectStr => {
    const project = {
      tags: new Set()
    }

    const lines = projectStr.split("\n")

    const outerProjectEl = project.el = makeEl(projectsEl, "div", "project")
    const projectEl = makeEl(outerProjectEl, "div", "project-body")

    const dateEl = makeEl(projectEl, "div", "project-date")
    const titleEl = makeEl(projectEl, "h2", "project-title")
    const descriptionEl = makeEl(projectEl, "p", "project-description")

    dateEl.innerText = project.date = lines[1].slice(7)
    titleEl.innerText = project.title = lines[0]
    descriptionEl.innerText = project.description = lines[3]

    const tagsEl = makeEl(projectEl, "div", "project-tags")

    const tags = projectStr.match(/`.+?`/g)
    if (tags) {
      tags.forEach(tag => {
        tag = tag.slice(1, -1)
        makeEl(tagsEl, "div", "project-tag", {
          innerText: tag
        })

        project.tags.add(tag)
      })
    }

    const linksEl = makeEl(projectEl, "div", "project-links")

    const inspirationLink = projectStr.match(/\[Inspiration\]\((.*)\)/)
    if (inspirationLink) {
      const linkEl = makeEl(linksEl, "a", "project-icon", {
        title: "Inspiration",
        target: "_BLANK",
        href: inspirationLink[1]
      })
      linkEl.innerHTML = inspirationIcon

      project.inspiration = inspirationLink[1]
    }

    const codeLink = projectStr.match(/\[Code\]\((.*)\)/)
    if (codeLink) {
      const linkEl = makeEl(linksEl, "a", "project-icon", {
        title: "Code",
        target: "_BLANK",
        href: codeLink[1]
      })
      linkEl.innerHTML = codeIcon
      linkEl.style.marginLeft = ".45em"

      project.code = codeLink[1]
    }

    const projectLink = projectStr.match(/\[(Project Site|Demo)\]\((.*)\)/)
    if (projectLink) {
      const linkEl = makeEl(linksEl, "a", "project-icon", {
        title: projectLink[1],
        target: "_BLANK",
        href: projectLink[2]
      })
      linkEl.innerHTML = projectIcon

      project.link = projectLink[2]
    }

    return project
  })

  const tagScores = { }
  projects.forEach(project => {
    const year = parseInt(project.date.slice(-4))
    const yearsAgo = new Date().getFullYear() - year

    project.tags = allTags(project.tags)
    project.tags.forEach(tag => {
      if (!tagScores[tag]) {
        tagScores[tag] = 0
      }
      tagScores[tag] += 1 / (0.5 * yearsAgo + 1)
    })
  })

  console.log(tagScores)

  var tagScoreList = []
  for (const tag in tagScores) {
    const score = tagScores[tag]

    tagScoreList.push({
      tag, score
    })
  }

  tagScoreList.sort((a, b) => b.score - a.score)
  console.log(tagScoreList)

  const maxScore = tagScoreList[0].score
  const minScore = tagScoreList[tagScoreList.length - 1].score

  const tagsEl = document.getElementById("tag-rankings")
  tagScoreList.forEach(({ tag, score }) => {
    const lerp = (score - minScore) / (maxScore - minScore)

    const tagEl = makeEl(tagsEl, "button", "project-tag")
    tagEl.innerText = tag
    tagEl.style.fontSize = `${lerp + 0.9}em`
    tagEl.style.cursor = "pointer"

    tagEl.onclick = () => {
      filterProjects(tag)
    }
  })
  
  const clearFilterEl = document.getElementById("clear-filter")
  clearFilterEl.style.display = "none"
  clearFilterEl.onclick = () => {
    filterProjects()
  }
})

const tagRelationships = {
  "Vue": new Set(["JavaScript"]),
  "WebGL": new Set(["JavaScript"]),
  "Bootstrap": new Set(["CSS"]),
  "SwiftUI": new Set(["Swift"]),
}

/**
 * @param { Set<string> } tags 
 */
function allTags(tags, result = new Set()) {
  tags.forEach(tag => {
    if (result.has(tag)) { return }

    result.add(tag)

    const relationships = tagRelationships[tag]
    if (relationships) {
      allTags(relationships, result)
    }
  })

  return result
}

function filterProjects(tag) {
  if (tag) {
    projects.forEach(project => {
      if (project.tags.has(tag)) {
        project.el.style.display = "block"
      } else {
        project.el.style.display = "none"
      }
    })

    document.getElementById("clear-filter").style.display = "block"
  } else {
    projects.forEach(project => {
      project.el.style.display = "block"
    })

    document.getElementById("clear-filter").style.display = "none"
  }

  for (tagEl of document.getElementById("tag-rankings").children) {
    if (tagEl.innerText === tag) {
      tagEl.style.backgroundColor = "#aaa"
      tagEl.style.color = "#000"
    } else {
      tagEl.style.backgroundColor = ""
      tagEl.style.color = ""
    }
  }
}