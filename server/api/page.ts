import Crawler from 'crawler';

export default defineEventHandler(async (event) => {
  const crawler = new Crawler({
    maxConnections: 10,
  });

  const res = await new Promise(resolve => {
    const schoolsLink: string[] = [];

    crawler.queue({
      uri: 'https://www.international-schools-database.com/in/kuala-lumpur',
      callback: (error, res, done) => {
        if (error) {
          console.log(error);
        } else {
          const $ = res.$;
          const linkHtml = $('.school-row.clickable.clickable-highlight')
          linkHtml.each((index, ele) => {
            const href = $(ele).attr('href') || '';
            schoolsLink.push(href)
          })
          resolve(schoolsLink)
        }
      }
    });
  })

  return {
    res
  }
})