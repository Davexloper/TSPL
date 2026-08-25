/* =========================================================
   GUIDELINES / REQUIREMENTS BOX
   ========================================================= */

.page-list .requirements-box {
    width: 100%;
    box-sizing: border-box;

    margin-top: 1.5rem;
    padding: 1.25rem;

    background: #f5f6f7;

    border: 1px solid #dfe1e5;
    border-radius: 14px;

    box-shadow:
        0 4px 14px rgba(0, 0, 0, 0.05);

    color: #24262b;
}


/* Title */

.page-list .requirements-box h3 {
    margin: 0 0 1rem 0;

    color: #17181c;

    font-size: 1.05rem;
    font-weight: 750;

    letter-spacing: -0.02em;

    padding-bottom: 0.8rem;

    border-bottom: 1px solid #dfe1e5;
}


/* Individual rules */

.page-list .requirements-box p {
    position: relative;

    margin: 0 0 0.6rem 0;

    padding: 0.75rem 0.85rem 0.75rem 2.4rem;

    background: #ffffff;

    border: 1px solid #e2e4e8;

    border-radius: 9px;

    color: #5f636b !important;

    font-size: 0.75rem;

    line-height: 1.55;

    box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.025);

    transition:
        border-color 0.15s ease,
        background 0.15s ease,
        transform 0.15s ease;
}


/* Remove margin from last rule */

.page-list .requirements-box p:last-child {
    margin-bottom: 0;
}


/* Orange bullet */

.page-list .requirements-box p::before {
    content: "✓";

    position: absolute;

    left: 0.8rem;
    top: 50%;

    transform: translateY(-50%);

    width: 20px;
    height: 20px;

    display: flex;

    align-items: center;
    justify-content: center;

    border-radius: 6px;

    background: #fff0e3;

    color: #ff6a00;

    font-size: 0.65rem;
    font-weight: 800;
}


/* Hover */

.page-list .requirements-box p:hover {
    background: #fffaf6;

    border-color:
        rgba(255, 106, 0, 0.25);

    transform: translateX(2px);
}
