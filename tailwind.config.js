const colors = require('tailwindcss/colors');

module.exports = {
    content: ['src/**/*.tsx'],
    theme: {
        extend: {
            colors: {
                green: colors.emerald,
            },
        },
    },
    plugins: [],
};
