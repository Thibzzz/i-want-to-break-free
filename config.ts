const config = {
  defaultInterval : 3 * 60 * 1000, // 6 seconds
  collapseConsole: false,
  clearConsole: false,
  siteWatch : [{
    name: "reddit",
    url: "https://wwww.reddit.com/",
    urlRegexp : '.*(reddit.com).*',
    interval: null,
  }],
  ruleSets : [
    {
      name: "reddit",
      rules: [
        {
          name : "remove ab testing shit",
          type: 'tag',
          offenderSelector: 'shreddit-experience-tree'
        },
        {
          name: "remove account modal",
          type: 'tag',
          offenderSelector: "accountmanager-iframe"
        },
        {
          name: "remove annonying google modal",
          type: 'tag',
          selectById: true,
          offenderSelector: "google-one-tap"
        },
        {
          name: "remove login modal",
          type: 'tag',
          offenderSelector: "modal-dialog",
          selectById: true
        },
        {
          name: "remove annoying modal",
          type: 'tag',
          offenderSelector: "xpromo-garlic-bread-blocking-modal-desktop"
        },
        {
          name: "remove annoying cookies",
          type: 'tag',
          offenderSelector: "reddit-cookie-banner"
        },
        {
          name: "remove NSFW modal",
          type: 'tag',
          offenderSelector : "xpromo-nsfw-blocking-modal-desktop"
        },
        {
          name: "purge style tag",
          type: "styleTag",
          offenderSelector : "body",
          offendingStyle: "pointer-events: none; overflow: hidden;"
        },
        {
          name: "purge class fixed that blocks scroll",
          type: "cssClass",
          offenderSelector: "reddit-header-large",
          offendingClass: "fixed",
        },
        {
          name: "purge blur",
          type: "styleTag",
          offenderSelector : "sidebar-grid pdp grid justify-items-center mx-auto grid-cols-1 gap-x-md xs:grid-cols-[repeat(8,_1fr)_repeat(4,minmax(61px,_1fr))] xs:gap-x-lg xs:mx-md m:grid-cols-[repeat(10,_1fr)_repeat(4,minmax(61px,_1fr))] m:mx-lg l:grid-cols-16 l:max-w-container-l l:mx-auto xl:grid-cols-18 xl:max-w-container-xl",
          offendingStyle: "filter: blur(4px)",
          selectByClass: true
        }
      ]
    }
  ]
}

export { config };