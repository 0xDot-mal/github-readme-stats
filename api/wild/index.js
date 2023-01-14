import { renderStatsCard } from "../src/cards/stats-card.js";
import {
  clampValue,
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "../src/common/utils.js";

export default async (req, res) => {
  const {
    hide,
    hide_title,
    hide_border,
    card_width,
    hide_rank,
    show_icons,
    line_height,
    title_color,
    ring_color,
    icon_color,
    text_color,
    text_bold,
    bg_color,
    theme,
    cache_seconds,
    custom_title,
    disable_animations,
    border_radius,
    border_color,
  } = req.query;
  res.setHeader("Content-Type", "image/svg+xml");

  try {
    const stats = {
      totalStars: req.query.totalStars,
      totalCommits: req.query.totalCommits,
      totalIssues: req.query.totalIssues,
      totalPRs: req.query.totalPRs,
      contributedTo: req.query.contributedTo,
      rank: {
        level: req.query.level || 'S',
        score: req.query.score || 10
      },
      starsTitle: req.query.starsTitle,
      commitsTitle: req.query.commitsTitle,
      issuesTitle: req.query.issuesTitle,
      PRsTitle: req.query.PRsTitle,
      contribsTitle: req.query.contribsTitle,
      title: req.query.title,
    };

    const cacheSeconds = clampValue(
      parseInt(cache_seconds || CONSTANTS.FOUR_HOURS, 10),
      CONSTANTS.FOUR_HOURS,
      CONSTANTS.ONE_DAY,
    );

    res.setHeader(
      "Cache-Control",
      `max-age=${
        cacheSeconds / 2
      }, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );

    return res.send(
      renderStatsCard(stats, {
        hide: parseArray(hide),
        show_icons: parseBoolean(show_icons),
        hide_title: parseBoolean(hide_title),
        hide_border: parseBoolean(hide_border),
        card_width: parseInt(card_width, 10),
        hide_rank: parseBoolean(hide_rank),
        line_height,
        title_color,
        ring_color,
        icon_color,
        text_color,
        text_bold: parseBoolean(text_bold),
        bg_color,
        theme,
        custom_title,
        border_radius,
        border_color,
        disable_animations: parseBoolean(disable_animations),
      }),
    );
  } catch (err) {
    res.setHeader("Cache-Control", `no-cache, no-store, must-revalidate`); // Don't cache error responses.
    return res.send(renderError(err.message, err.secondaryMessage));
  }
};
