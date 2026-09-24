/* ==========================================================================
   Site content. Edit this file to add papers, talks, videos and photographs.
   Pages read these lists and render them; no build step is needed.
   ========================================================================== */

window.SITE = {
  /* ------------------------------------------------------------------
     Publications
     type: "first"      first-author refereed papers
           "collab"     co-authored papers (JWST ERS collaboration)
           "whitepaper" community white papers
     ------------------------------------------------------------------ */
  publications: [
    {
      type: "first", year: 2026,
      title: "A study on the contribution of the interplanetary medium in radio occultation experiments",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Banerjee, S., Manikantan, R., Sharma, A., Imamura, T.",
      venue: "Icarus",
      doi: "10.1016/j.icarus.2026.117291",
      arxiv: "2608.03435",
      missions: ["Chandrayaan-2", "Chandrayaan-3", "Venus Express", "Akatsuki"]
    },
    {
      type: "first", year: 2026,
      title: "Plasma turbulence in the lunar environment across solar wind and magnetotail conditions: Observations from Chandrayaan-2 Radio Science experiment",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Sharma, A.",
      venue: "Journal of Geophysical Research: Planets",
      doi: "10.1029/2026JE009957",
      arxiv: "2608.15512",
      missions: ["Chandrayaan-2"]
    },
    {
      type: "first", year: 2026,
      title: "A turbulence index independent framework for deriving solar wind speed and coronal electron density from radio spectral broadening",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Banerjee, S., Imamura, T., Ando, H.",
      venue: "Monthly Notices of the Royal Astronomical Society",
      doi: "10.1093/mnras/stag554",
      arxiv: "2603.20874",
      missions: ["Akatsuki"]
    },
    {
      type: "first", year: 2026,
      title: "A generalized method for estimating solar wind speeds and densities using spectral broadening for a Kolmogorov turbulence spectrum",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Roopa, M. V., Imamura, T.",
      venue: "Advances in Space Research",
      doi: "10.1016/j.asr.2026.03.059",
      arxiv: "2603.23929",
      missions: ["Mars Orbiter Mission", "Akatsuki"]
    },
    {
      type: "first", year: 2025,
      title: "On the estimation of solar wind velocity under varying solar activity conditions using Akatsuki measurements",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Imamura, T.",
      venue: "Monthly Notices of the Royal Astronomical Society",
      doi: "10.1093/mnras/staf1305",
      arxiv: "2508.06381",
      missions: ["Akatsuki"]
    },
    {
      type: "first", year: 2025,
      title: "Insights into solar wind flow speeds from the coronal radio occultation experiment: Findings from the Indian Mars Orbiter Mission",
      authors: "Aggarwal, K., Choudhary, R. K., Datta, A., Roopa, M. V., Dai, B. K.",
      venue: "The Astrophysical Journal",
      doi: "10.3847/1538-4357/adb627",
      arxiv: "2502.09512",
      code: "https://github.com/jovian-explorer/Sun",
      missions: ["Mars Orbiter Mission"]
    },

    {
      type: "collab", year: 2024,
      title: "A benchmark JWST near-infrared spectrum for the exoplanet WASP-39 b",
      authors: "Carter, A. L., May, E. M., Espinoza, N., Welbanks, L., et al. (incl. Aggarwal, K.)",
      venue: "Nature Astronomy",
      doi: "10.1038/s41550-024-02292-x"
    },
    {
      type: "collab", year: 2024,
      title: "Nightside clouds and disequilibrium chemistry on the hot Jupiter WASP-43b",
      authors: "Bell, T. J., Crouzet, N., Cubillos, P., Kreidberg, L., Piette, A. A. A., et al. (incl. Aggarwal, K.)",
      venue: "Nature Astronomy",
      doi: "10.1038/s41550-024-02230-x"
    },
    {
      type: "collab", year: 2024,
      title: "Sulphur dioxide in the mid-infrared transmission spectrum of WASP-39b",
      authors: "Powell, D., Feinstein, A., Lee, E., Zhang, M., Tsai, S., Taylor, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-024-07040-9"
    },
    {
      type: "collab", year: 2023,
      title: "Photochemically produced SO₂ in the atmosphere of WASP-39b",
      authors: "Tsai, S., Lee, E., Powell, D., Gao, P., Zhang, X., Moses, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-023-05902-2"
    },
    {
      type: "collab", year: 2023,
      title: "Detection of carbon monoxide’s 4.6 micron fundamental band structure in WASP-39b’s atmosphere with JWST NIRSpec G395H",
      authors: "Grant, D., Lothringer, J. D., Wakeford, H. R., et al. (incl. Aggarwal, K.)",
      venue: "The Astrophysical Journal Letters",
      doi: "10.3847/2041-8213/acd544"
    },
    {
      type: "collab", year: 2023,
      title: "A broadband thermal emission spectrum of the ultra-hot Jupiter WASP-18b",
      authors: "Coulombe, L.-P., Benneke, B., Challener, R., Piette, A., Wiser, L., Mansfield, M., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-023-06230-1"
    },
    {
      type: "collab", year: 2023,
      title: "Identification of carbon dioxide in an exoplanet atmosphere",
      authors: "JWST Transiting Exoplanet Community Early Release Science Team: Ahrer, E., Alderson, L., Batalha, N., Bean, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05269-w",
      code: "https://github.com/jovian-explorer/Identification-of-carbon-dioxide-in-an-exoplanet-atmosphere"
    },
    {
      type: "collab", year: 2023,
      title: "Early Release Science of the exoplanet WASP-39b with JWST NIRSpec PRISM",
      authors: "Rustamkulov, Z., Sing, D., Mukherjee, S., May, E., Kirk, J., Schlawin, E., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05677-y"
    },
    {
      type: "collab", year: 2023,
      title: "Early Release Science of the exoplanet WASP-39b with JWST NIRSpec G395H",
      authors: "Alderson, L., Wakeford, H., Alam, M., Batalha, N., Lothringer, J., Redai, J., et al. (incl. Aggarwal, K.)",
      venue: "Nature",
      doi: "10.1038/s41586-022-05591-3"
    },

    {
      type: "whitepaper", year: 2023,
      title: "Improving multi-dimensional data formats, access, and assimilation tools for the twenty-first century",
      authors: "Seaton, D., Caspi, A., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i361"
    },
    {
      type: "whitepaper", year: 2023,
      title: "COMPLETE: a flagship mission for complete understanding of 3D coronal magnetic energy release",
      authors: "Caspi, A., Seaton, D., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i048"
    },
    {
      type: "whitepaper", year: 2023,
      title: "Magnetic energy powers the corona: how we can understand its 3D storage & release",
      authors: "Caspi, A., Seaton, D., Casini, R., Downs, C., Gibson, S., Gilbert, H., et al. (incl. Aggarwal, K.)",
      venue: "Bulletin of the AAS 55(3), Heliophysics Decadal Survey white paper",
      url: "https://baas.aas.org/pub/2023n3i049"
    }
  ],

  /* ------------------------------------------------------------------
     Conference presentations and travel.
     date: "YYYY-MM" (used for sorting). kind: Poster | Talk | Invited talk
     ------------------------------------------------------------------ */
  conferences: [
    {
      date: "2025-09", dates: "8–11 Sep 2025", kind: "Poster",
      event: "UK Space Weather and Space Environment Meeting III",
      place: "University of Sheffield, United Kingdom",
      title: "Probing the solar wind using Akatsuki radio signals",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/UKSWSE_Sheffield_UK.pdf"
    },
    {
      date: "2025-09", dates: "8–10 Sep 2025", kind: "Poster",
      event: "ASI Symposium 003, Astronomical Society of India",
      place: "JECRC University, Jaipur, India",
      title: "Probing the Smiley-Sun using Akatsuki radio signals",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/ASI_Symposium_Jaipur.pdf"
    },
    {
      date: "2025-03", dates: "4–7 Mar 2025", kind: "Poster",
      event: "6th Indian Planetary Science Conference (IPSC)",
      place: "IIT Roorkee, India",
      title: "On the estimation of solar wind velocity using spectral characteristics of the probing radio signals: results from solar occultation measurements using Indian Mars Orbiter Mission",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/IPSC_IITR.pdf"
    },
    {
      date: "2024-10", dates: "22–25 Oct 2024", kind: "Poster",
      event: "6th URSI Regional Conference on Radio Science (URSI-RCRS)",
      place: "Graphic Era Hill University, Bhimtal, India",
      title: "Results from radio occultation studies using Indian Mars Orbiter Mission",
      pdf: "https://github.com/jovian-explorer/Conference-posters/blob/main/URSI_Poster_GEHU_Bhimtal_2024.pdf"
    }
  ],

  /* ------------------------------------------------------------------
     YouTube videos. Add one entry per video.
     id: the 11-character code after "watch?v=" in the video URL.
     Example:
       { id: "dQw4w9WgXcQ", title: "Radio occultation, explained", date: "2025-06", note: "Lecture, 42 min" },
     ------------------------------------------------------------------ */
  videos: [
  ],

  /* ------------------------------------------------------------------
     Photographs. Put image files in assets/photos/ and list them here.
     category: "Astrophotography" | "Travel" | "Conferences" | "Field"
     Example:
       { src: "assets/photos/milky-way-hanle.jpg", title: "Milky Way over Hanle", place: "Ladakh, India", date: "2024-05", category: "Astrophotography", camera: "Canon EOS R7" },
     ------------------------------------------------------------------ */
  photos: [
  ]
};
