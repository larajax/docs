export default {
    title: 'Larajax',
    description: 'AJAX for Laravel, without the boilerplate',
    head: [
        ['link', { rel: 'icon', href: '/favicon.svg' }]
    ],
    themeConfig: {
        logo: '/favicon.svg',
        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Reference', link: '/api/reference' },
            { text: 'GitHub', link: 'https://github.com/larajax/larajax' }
            // { text: 'Features', link: '/guide/api' },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: "Introduction",
                    items: [
                        { text: 'Getting Started', link: '/guide/getting-started' },
                        { text: 'Installation', link: '/guide/installation' }
                    ]
                },
                {
                    text: "Core Concepts",
                    items: [
                        { text: 'Working with Data', link: '/guide/working-with-data' },
                        { text: 'Working with Query', link: '/guide/working-with-query' }
                    ]
                },
                {
                    text: "Laravel Integration",
                    items: [
                        { text: 'Controller Integration', link: '/guide/controller-integration' },
                        { text: 'Defining Components', link: '/guide/defining-components' }
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/larajax/larajax' }
        ],
        search: { provider: 'local' }
    }
}
