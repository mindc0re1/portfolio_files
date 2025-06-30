const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.static("public"));
const port = process.env.PORT || 3000;

// Jenkins credentials
const jenkinsUrl = "https://jenkins.autotests.cloud";
const jobName = "Fullcontact_test";
const user = "mindc0re1";
const apiToken = "116244bd232797d1ba2ce39b436415bdd7";
const triggerToken = "portfolioToken123";

async function getCrumb() {
  const res = await axios.get(`${jenkinsUrl}/crumbIssuer/api/json`, {
    auth: {
      username: user,
      password: apiToken
    }
  });
  return res.data;
}

app.get("/trigger-build", async (req, res) => {
  try {
    const crumbData = await getCrumb();
    const headers = {
      [crumbData.crumbRequestField]: crumbData.crumb
    };

    await axios.post(`${jenkinsUrl}/job/${jobName}/build?token=${triggerToken}`, {}, {
      auth: {
        username: user,
        password: apiToken
      },
      headers
    });

    res.status(200).send("✅ Build triggered successfully!");
  } catch (error) {
    console.error("Error triggering build:", error.response?.data || error.message);
    res.status(500).send("❌ Failed to trigger build");
  }
});

app.listen(port, () => {
  console.log(`Build trigger server running at http://localhost:${port}`);
});
