/**
 * Numbers of decimal digits to round to
 */
const scale = 0;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @param {Number} totalLevels Total number of levels on the list
 * @returns {Number}
 */
export function score(rank, percent, minPercent, totalLevels = 150) {
    if (rank > totalLevels) {
        return 0;
    }

    if (rank > 75 && percent < 100) {
        return 0;
    }

    /*
     * Dynamic scoring:
     *
     * #1 = 250 points
     * Last level = 1 point
     *
     * The amount of points is distributed evenly
     * between the first and last level.
     */
    let score = 250;

    if (totalLevels > 1) {
        score = 250 - (rank - 1) * (249 / (totalLevels - 1));
    }

    /*
     * Apply percentage completion.
     */
    score *= (
        (percent - (minPercent - 1)) /
        (100 - (minPercent - 1))
    );

    score = Math.max(0, score);

    /*
     * Non-100% records receive 2/3 of the normal score.
     */
    if (percent != 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
}

export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';

        if (+arr[1] + scale > 0) {
            sig = '+';
        }

        return +(
            Math.round(
                +arr[0] +
                'e' +
                sig +
                (+arr[1] + scale)
            ) +
            'e-' +
            scale
        );
    }
}
