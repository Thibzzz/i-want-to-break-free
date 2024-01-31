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
    }
  ]
}

export { linkedinRules }
