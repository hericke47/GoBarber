interface IMailConfig {
    driver: 'ethereal' | 'ses';

    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || 'ethereal',

    defaults: {
        from: {
            email: 'herick.exterkoetter@planethub.dev',
            name: 'Herick da planetHub',
        },
    },
} as IMailConfig;
