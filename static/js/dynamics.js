(() => {
    const sidePanel = document.getElementById('navSidePanel');
    const sidePanelLinks = document.querySelectorAll('#navSidePanel .nav-link[href^="#"]');
    const desktopNavLinks = document.querySelectorAll('#navbarNav .nav-link[href^="#"]');
    const mobileBrand = document.querySelector('.navbar-brand-mobile');

    const isPanelOpen = () => {
        return sidePanel && (sidePanel.classList.contains('show') || sidePanel.classList.contains('showing'));
    };

    const setActiveLink = (href) => {
        document.querySelectorAll('.nav-link[href^="#"]').forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === href);
        });
    };

    const scrollToSection = (target) => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${target.id}`);
    };

    const navigateToSection = (href, closePanel) => {
        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        setActiveLink(href);

        const scroll = () => scrollToSection(target);

        if (closePanel && isPanelOpen()) {
            sidePanel.addEventListener('hidden.bs.offcanvas', scroll, { once: true });
            bootstrap.Offcanvas.getOrCreateInstance(sidePanel).hide();
        } else {
            scroll();
        }
    };

    sidePanelLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href) {
                return;
            }

            event.preventDefault();
            navigateToSection(href, true);
        });
    });

    desktopNavLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href) {
                return;
            }

            event.preventDefault();
            navigateToSection(href, false);
        });
    });

    if (mobileBrand) {
        mobileBrand.addEventListener('click', (event) => {
            const href = mobileBrand.getAttribute('href');
            if (!href) {
                return;
            }

            event.preventDefault();
            navigateToSection(href, isPanelOpen());
        });
    }
})();
