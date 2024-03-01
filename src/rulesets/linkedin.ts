const linkedinRules = {
  name: "linkedin",
  rules: [
    {
      name: "remove actualités by label",
      type: "ariaLabel",
      offenderSelector: "LinkedIn Actualités"
    },
    {
      name: "removed ads by label",
      type: "tagLabel",
      offenderSelector: "occludable-update",
      ariaLabel: "Post sponsorisé"
    }, 
    {
      name: "remove suggestions from feed",
      type: "nestedContent",
      tagName: "span",
      content: "Suggestions",
      offenderSelector: "feed-shared-update-v2",
    },
    {
      name: "remove 'expert answers', i don't want to train your algorithms",
      type: "nestedContent",
      tagName: "span",
      content: "Réponses d’experts sur",
      offenderSelector: "occludable-update",
    },
    {
      name: "remove 'promoted by' from feed, this is pure ads",
      type: "nestedContent",
      tagName: "span",
      content: "Promu(e) par",
      offenderSelector: "occludable-update",
    },
  ]
}

export { linkedinRules }
