const schedule = require("node-schedule");
const axios = require("axios");

const fetchCollect = async () => {
  try {
    const baseUrl = "https://server.drezzo.io/api/";
    const date = new Date();
    const bearerToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjc0MzcyNjk3LCJleHAiOjE2NzY5NjQ2OTd9.ErU8S0PhdKxWDR5T5T_QIxjO7cE-t4xwST8e1Zr_gho";
    const dateNow = date.toISOString();
    const airdropUrl = `${baseUrl}airdrops?filters[$and][0][airdropEndDate][$gt]=${dateNow}&filters[$and][1][airdropStartDate][$lt]=${dateNow}&populate=*`;
    const airdrop = await axios.get(airdropUrl);
    if (airdrop.data.data.length > 0) {
      airdrop.data.data.map(async (item) => {
        const config = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + bearerToken,
          },
        };
        await axios.post(
          `${baseUrl}collect`,
          {
            productId: item.attributes.product.data.id,
          },
          config
        );
      });
    }
  } catch (e) {
    throw e;
  }
};
fetchCollect();
schedule.scheduleJob("10 * * * *", () => {
  fetchCollect();
});
