const { getApp } = require('./app');

getApp().then((app) => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`SkillQuest API running on http://localhost:${port}`);
  });
});
