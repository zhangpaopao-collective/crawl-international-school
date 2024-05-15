import { CheerioCrawler, PuppeteerCrawler, KeyValueStore } from 'crawlee';
import * as cheerio from 'cheerio';

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

// async function getEachSchoolHtml(url: string, idx: number) {
//   const crawler = new CheerioCrawler({
//     maxRequestRetries: 5,
//     async requestHandler({ request, response, body, contentType, $, }) {
//       await KeyValueStore.setValue(`school-${idx}`, body);
//     },
//   });

//   await crawler.run([url]);
// }

async function getEachSchoolHtml(url: string, idx: number) {
  const crawler = new PuppeteerCrawler({
    maxRequestRetries: 5,
    async requestHandler({ request, page }) {
      const content = await page.content()
      await KeyValueStore.setValue(`school-${idx}`, content);
    },
  });

  await crawler.run([url]);
}

// async function getAllHtml() {
//   const schoolsLink: string[] = [];
//   const crawler = new CheerioCrawler({
//     async requestHandler({ request, response, body, contentType, $, }) {
//       await KeyValueStore.setValue('main', body);
//       const schoolNameHtml = $('.card-row-title.school-name');
//       schoolNameHtml.each(async (idx, ele) => {
//         const a =  $(ele).find('a')
//         schoolsLink.push(a.attr('href') || '')
//       })
//     },
//   });

//   await crawler.run(['https://www.international-schools-database.com/in/kuala-lumpur']);
//   // await crawler.run(['https://www.mi.com/']);

//   schoolsLink.forEach(async (schoolLink, index) => {
//     await getEachSchoolHtml(schoolLink, index)
//     await sleep(1000 * 60 * 10)
//   })
// }

async function getAllHtml() {
  const schoolsLink: string[] = [];
  const crawler = new PuppeteerCrawler({
    async requestHandler({ request, page }) {
      const content = await page.content()
      await KeyValueStore.setValue('main', content);
      const $ = cheerio.load(content)
      const schoolNameHtml = $('.card-row-title.school-name');
      schoolNameHtml.each(async (idx, ele) => {
        const a =  $(ele).find('a')
        schoolsLink.push(a.attr('href') || '')
      })
    },
  });

  await crawler.run(['https://www.international-schools-database.com/in/kuala-lumpur']);
  // await crawler.run(['https://www.mi.com/']);

  schoolsLink.forEach(async (schoolLink, index) => {
    await getEachSchoolHtml(schoolLink, index)
    await sleep(1000 * 60 * 10)
  })
}


export default defineEventHandler(async (event) => {
  getAllHtml()

  return {
    code: 0
  }
})