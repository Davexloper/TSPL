:root {
    --color-background: white;
    --color-on-background: black;

    --color-background-hover: #f5f5f5;
    --color-on-background-hover: black;

    --color-primary: #ff6a00;
    --color-primary-hover: #ff7a1a;
    --color-primary-light: rgba(255, 106, 0, 0.10);
    --color-on-primary: white;

    --color-error: #de0000;
    --color-on-error: white;

    --color-border: #e5e7eb;
    --color-border-hover: #d5d8dd;

    --color-surface: #ffffff;
    --color-surface-hover: #fafafa;

    --color-discord: #5865f2;
}

html,
body {
    height: 100%;
}

body {
    display: flex;
    flex-direction: column;
    margin: 0;

    background: #ffffff;
    color: #17181c;

    font-family:
        "Lexend Deca",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
}


/* =========================================================
   HEADER
   ========================================================= */

header,
main {
    background-color: var(--color-background);
    color: var(--color-on-background);

    display: grid;

    grid-template-columns:
        minmax(16rem, 1fr)
        minmax(16rem, 2fr)
        minmax(16rem, 1fr);

    column-gap: 2rem;
}

header {
    display: flex;

    padding-inline: calc(25vw - 10rem);

    height: 4rem;

    background:
        linear-gradient(
            135deg,
            #ff6a00,
            #f05b00
        );

    color: white;

    border-bottom:
        1px solid rgba(0, 0, 0, 0.08);

    box-shadow:
        0 3px 12px rgba(0, 0, 0, 0.08);

    position: relative;
    z-index: 10;
}

@media screen and (min-width: 1366px) {
    header {
        display: grid;
        padding-inline: 0;
    }
}

header .logo {
    justify-self: end;
    align-self: center;

    display: flex;

    align-items: center;

    gap: 0.75rem;
}

header .nav {
    flex: 1;

    display: flex;
    align-items: center;
}


/* =========================================================
   HEADER LINKS
   ========================================================= */

header a {
    color: #ffffff !important;

    text-decoration: none;

    font-weight: 600;

    opacity: 0.92;

    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
}

header a:hover {
    color: #ffffff !important;

    opacity: 1;

    text-decoration: none;

    transform: translateY(-1px);
}


/* =========================================================
   MAIN
   ========================================================= */

main {
    height: 0;

    flex: 1;

    display: grid;

    grid-template-rows:
        minmax(0, 1fr);

    column-gap: 2rem;

    background:
        #ffffff;
}

main > div {
    overflow-y: auto;

    min-width: 0;
}


/* =========================================================
   SPINNER
   ========================================================= */

.spinner {
    display: flex;

    align-items: center;
    justify-content: center;

    grid-column: span 3;
}


/* =========================================================
   CHECKBOX
   ========================================================= */

input[type="checkbox"] {
    height: 1.25rem;
    width: 1.25rem;

    cursor: pointer;

    margin: 0;

    accent-color: #ff6a00;
}


/* =========================================================
   GENERAL CARDS
   ========================================================= */

.card,
.panel,
.section,
.rules,
.guidelines,
.requirements {
    background: #ffffff;

    color: #17181c;

    border:
        1px solid #e5e7eb;

    border-radius:
        14px;

    box-shadow:
        0 5px 18px rgba(0, 0, 0, 0.045);

    transition:
        transform 0.16s ease,
        box-shadow 0.16s ease,
        border-color 0.16s ease;
}

.card:hover,
.panel:hover,
.section:hover,
.rules:hover,
.guidelines:hover,
.requirements:hover {
    border-color:
        #d9dce1;

    box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.07);
}


/* =========================================================
   GUIDELINES CARD
   ========================================================= */

.guidelines-card {
    position: relative;

    width: 100%;

    box-sizing: border-box;

    margin-bottom: 1.25rem;

    background: #ffffff !important;

    color: #17181c !important;

    border:
        1px solid #e5e7eb;

    border-radius:
        16px;

    overflow: hidden;

    box-shadow:
        0 6px 22px rgba(0, 0, 0, 0.06);

    transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        border-color 160ms ease;
}

.guidelines-card:hover {
    transform:
        translateY(-2px);

    border-color:
        #d9dce1;

    box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.08);
}


/* =========================================================
   GUIDELINES HEADER
   ========================================================= */

.guidelines-card__header {
    position: relative;

    display: flex;

    align-items: center;

    gap: 0.85rem;

    padding:
        1.15rem 1.25rem;

    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #fff8f2 100%
        ) !important;

    border-bottom:
        1px solid #ececef;
}

.guidelines-card__header::before {
    content: "";

    position: absolute;

    left: 0;
    top: 0;
    bottom: 0;

    width: 4px;

    background:
        linear-gradient(
            180deg,
            #ff7a1a,
            #ff5c00
        );
}


/* =========================================================
   GUIDELINES ICON
   ========================================================= */

.guidelines-card__icon {
    width: 38px;
    height: 38px;

    flex-shrink: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius:
        10px;

    background:
        #fff0e3;

    color:
        #ff6a00 !important;

    border:
        1px solid rgba(255, 106, 0, 0.12);

    font-size:
        1rem;

    font-weight:
        700;
}


/* =========================================================
   GUIDELINES HEADING
   ========================================================= */

.guidelines-card__heading {
    display: flex;

    flex-direction: column;

    gap: 0.15rem;
}

.guidelines-card__heading h3 {
    margin: 0;

    color:
        #17181c !important;

    font-size:
        1.05rem;

    font-weight:
        700;

    letter-spacing:
        -0.025em;
}

.guidelines-card__heading span {
    color:
        #858991 !important;

    font-size:
        0.72rem;

    line-height:
        1.4;
}


/* =========================================================
   GUIDELINES BODY
   ========================================================= */

.guidelines-card__body {
    display: flex;

    flex-direction: column;

    gap:
        0.55rem;

    padding:
        1rem;

    background:
        #ffffff !important;
}


/* =========================================================
   INDIVIDUAL GUIDELINE BOX
   ========================================================= */

.guidelines-card .guideline {
    display: flex;

    align-items: flex-start;

    gap:
        0.75rem;

    padding:
        0.85rem;

    background:
        #ffffff !important;

    color:
        #24262b !important;

    border:
        1px solid #eceef1;

    border-radius:
        10px;

    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.025);

    transition:
        border-color 140ms ease,
        background 140ms ease,
        transform 140ms ease,
        box-shadow 140ms ease;
}

.guidelines-card .guideline:hover {
    background:
        #fffaf6 !important;

    border-color:
        rgba(255, 106, 0, 0.28);

    transform:
        translateX(2px);

    box-shadow:
        0 5px 14px rgba(0, 0, 0, 0.05);
}


/* =========================================================
   GUIDELINE NUMBER
   ========================================================= */

.guideline__number {
    width:
        28px;

    height:
        28px;

    flex-shrink:
        0;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    border-radius:
        8px;

    background:
        #fff1e5;

    color:
        #ff6500 !important;

    border:
        1px solid rgba(255, 106, 0, 0.12);

    font-size:
        0.63rem;

    font-weight:
        700;
}


/* =========================================================
   GUIDELINE TEXT
   ========================================================= */

.guideline__text {
    min-width:
        0;

    flex:
        1;
}

.guideline__text strong {
    display:
        block;

    margin-bottom:
        0.2rem;

    color:
        #24262b !important;

    font-size:
        0.78rem;

    font-weight:
        700;
}

.guideline__text p {
    margin:
        0;

    color:
        #777b83 !important;

    font-size:
        0.7rem;

    line-height:
        1.5;
}


/* =========================================================
   GUIDELINES FOOTER
   ========================================================= */

.guidelines-card__footer {
    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        1rem;

    padding:
        0.7rem 1rem;

    background:
        #fafafa !important;

    border-top:
        1px solid #ececef;

    color:
        #9a9da3 !important;

    font-size:
        0.65rem;
}

.guidelines-card__status {
    color:
        #22a06b !important;

    font-weight:
        700;
}


/* =========================================================
   DISCORD
   ========================================================= */

.discord,
.discord-link,
.discord-button,
.discord-icon {
    color:
        #5865f2 !important;
}

.discord-button {
    background:
        rgba(88, 101, 242, 0.10) !important;

    border:
        1px solid rgba(88, 101, 242, 0.22) !important;

    border-radius:
        9px;

    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;
}

.discord-button:hover {
    background:
        rgba(88, 101, 242, 0.17) !important;

    border-color:
        rgba(88, 101, 242, 0.40) !important;

    color:
        #5865f2 !important;
}


/* =========================================================
   EDITOR
   ========================================================= */

.editor,
.editor-container,
.guidelines-editor,
.rules-editor {
    background:
        #ffffff !important;

    color:
        #17181c !important;

    border:
        1px solid #e5e7eb;

    border-radius:
        14px;

    overflow:
        hidden;

    box-shadow:
        0 5px 18px rgba(0, 0, 0, 0.045);

    margin-bottom:
        1rem;
}

.editor-header,
.editor-title,
.guidelines-header,
.rules-header {
    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    min-height:
        58px;

    padding:
        0 1.25rem;

    background:
        #fafafa !important;

    color:
        #17181c !important;

    border-bottom:
        1px solid #e5e7eb;
}

.editor-body,
.editor-content,
.guidelines-content,
.rules-content {
    padding:
        1.25rem;

    background:
        #ffffff !important;

    color:
        #17181c !important;
}


/* =========================================================
   TOOLBAR
   ========================================================= */

.toolbar,
.editor-toolbar {
    display:
        flex;

    align-items:
        center;

    gap:
        0.35rem;

    padding:
        0.55rem 0.7rem;

    margin-bottom:
        0.85rem;

    background:
        #f7f7f8 !important;

    border:
        1px solid #e3e5e8;

    border-radius:
        8px;
}

.toolbar button,
.editor-toolbar button {
    width:
        32px;

    height:
        32px;

    padding:
        0;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    background:
        transparent !important;

    color:
        #666b74 !important;

    border:
        0;

    border-radius:
        7px;

    box-shadow:
        none;
}

.toolbar button:hover,
.editor-toolbar button:hover {
    background:
        #fff0e3 !important;

    color:
        #ff6a00 !important;

    transform:
        none;

    box-shadow:
        none;
}


/* =========================================================
   TEXT EDITOR
   ========================================================= */

[contenteditable="true"] {
    min-height:
        160px;

    padding:
        1rem;

    background:
        #ffffff !important;

    color:
        #17181c !important;

    border:
        1px solid #dfe2e6;

    border-radius:
        8px;

    outline:
        none;

    line-height:
        1.6;

    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

[contenteditable="true"]:focus {
    border-color:
        #ff6a00;

    box-shadow:
        0 0 0 3px
        rgba(255, 106, 0, 0.10);
}


/* =========================================================
   INPUTS
   ========================================================= */

input,
textarea,
select {
    box-sizing:
        border-box;

    background:
        #ffffff !important;

    color:
        #17181c !important;

    border:
        1px solid #dfe2e6;

    border-radius:
        8px;

    padding:
        0.65rem 0.75rem;

    font-family:
        inherit;

    outline:
        none;

    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

input:hover,
textarea:hover,
select:hover {
    border-color:
        #cfd3d8;
}

input:focus,
textarea:focus,
select:focus {
    border-color:
        #ff6a00;

    box-shadow:
        0 0 0 3px
        rgba(255, 106, 0, 0.10);
}


/* =========================================================
   BUTTONS
   ========================================================= */

button {
    border:
        0;

    border-radius:
        8px;

    padding:
        0.6rem 1rem;

    background:
        linear-gradient(
            135deg,
            #ff7415,
            #ff5d00
        ) !important;

    color:
        #ffffff !important;

    font-family:
        inherit;

    font-weight:
        700;

    cursor:
        pointer;

    box-shadow:
        0 3px 9px
        rgba(255, 106, 0, 0.16);

    transition:
        background 0.15s ease,
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

button:hover {
    background:
        linear-gradient(
            135deg,
            #ff7a1a,
            #e95700
        ) !important;

    transform:
        translateY(-1px);

    box-shadow:
        0 8px 20px
        rgba(255, 106, 0, 0.18);
}

button:active {
    transform:
        translateY(0);
}


/* =========================================================
   SECONDARY BUTTON
   ========================================================= */

button.secondary,
.secondary-button {
    background:
        #ffffff !important;

    color:
        #44474e !important;

    border:
        1px solid #dfe2e6;

    box-shadow:
        none;
}

button.secondary:hover,
.secondary-button:hover {
    background:
        #fff8f2 !important;

    color:
        #ff6a00 !important;

    border-color:
        #ff6a00;

    box-shadow:
        none;
}


/* =========================================================
   LINKS
   ========================================================= */

a {
    color:
        #ff6500;

    text-decoration:
        none;

    font-weight:
        600;

    transition:
        color 0.15s ease;
}

a:hover {
    color:
        #e95700;

    text-decoration:
        underline;
}


/* =========================================================
   TYPOGRAPHY
   ========================================================= */

h1,
h2,
h3,
h4,
h5,
h6 {
    color:
        #17181c !important;

    letter-spacing:
        -0.02em;
}

p {
    color:
        #666b74 !important;

    line-height:
        1.6;
}


/* =========================================================
   INFO BOX
   ========================================================= */

.info-box {
    padding:
        1rem 1.1rem;

    margin-bottom:
        1rem;

    background:
        rgba(255, 106, 0, 0.07);

    border:
        1px solid
        rgba(255, 106, 0, 0.20);

    border-radius:
        12px;

    color:
        #b94f00;
}


/* =========================================================
   BADGES
   ========================================================= */

.badge {
    display:
        inline-flex;

    align-items:
        center;

    padding:
        0.3rem 0.65rem;

    border-radius:
        999px;

    background:
        rgba(255, 106, 0, 0.08);

    border:
        1px solid
        rgba(255, 106, 0, 0.18);

    color:
        #ff6500;

    font-size:
        0.7rem;

    font-weight:
        700;
}


/* =========================================================
   DIVIDERS
   ========================================================= */

hr {
    border:
        0;

    border-top:
        1px solid #e5e7eb;

    margin:
        1.25rem 0;
}


/* =========================================================
   SCROLLBAR
   ========================================================= */

::-webkit-scrollbar {
    width:
        8px;

    height:
        8px;
}

::-webkit-scrollbar-track {
    background:
        transparent;
}

::-webkit-scrollbar-thumb {
    background:
        #d5d8dd;

    border-radius:
        999px;
}

::-webkit-scrollbar-thumb:hover {
    background:
        #bfc3c9;
}


/* =========================================================
   MOBILE
   ========================================================= */

@media screen and (max-width: 900px) {
    header,
    main {
        grid-template-columns:
            1fr;
    }

    main {
        height:
            auto;

        padding:
            1rem;
    }

    main > div {
        overflow:
            visible;
    }

    header {
        min-height:
            4rem;

        padding:
            0 1rem;
    }

    .guidelines-card__header {
        padding:
            1rem;
    }

    .guidelines-card__body {
        padding:
            0.75rem;
    }
}

@media screen and (max-width: 600px) {
    .guidelines-card__heading span {
        display:
            none;
    }

    .guidelines-card__footer {
        align-items:
            flex-start;

        flex-direction:
            column;

        gap:
            0.25rem;
    }
}
