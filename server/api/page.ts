import Crawler from 'crawler';

export interface School {
  name: string,
  curriculum: string,
  language: string,
  ages: string,
  fees?: string[],
  feesUnit: string,
  link: string,
  city: string,
  isNativeEnglishTeachers: string,
  extraEnglish: string,
  classSizes: {
    average: string,
    maximum: string,
  },
  extraCurricularActivities: string,
  schoolBus: string,
}

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export default defineEventHandler(async (event) => {
  const crawler = new Crawler({
    maxConnections: 10,
  });

  const schools: Partial<School>[] = []

  await new Promise(resolve => {
    crawler.queue({
      uri: 'https://www.international-schools-database.com/in/kuala-lumpur',
      // uri: 'https://www.baidu.com',
      callback: (error, res, done) => {
        if (error) {
          console.log(error);
        } else {
          const $ = res.$;
          const schoolNameHtml = $('.card-row-title.school-name');
          schoolNameHtml.each((idx, ele) => {
            const a =  $(ele).find('a')
            if(!schools[idx]) {
              schools[idx] = {};
            }
            schools[idx].name = a.text()
            schools[idx].link = a.attr('href')
          })

          const schoolBasicInfoHtml = $('.card-row-properties > dl');

          schoolBasicInfoHtml.each((idx, ele) => {
            const dd = $(ele).find('dd')
            const dt = $(ele).find('dt')
            if(!schools[idx]) {
              schools[idx] = {};
            }

            schools[idx].curriculum = $(dt[0]).text()
            schools[idx].language = $(dt[1]).text()
            schools[idx].ages = $(dt[2]).text();
            const currency = $(dt[3]).find('.currency');
            if(currency) {
              schools[idx].fees = [$(currency[0]).text(), $(currency[1]).text()];
            }
          })
          resolve(done())
        }
      }
    });
  })

  for (let idx = 0; idx < schools.length; idx++) {
    const school = schools[idx];
    await sleep(10000)
    if(school.link) {
      await new Promise(resolve => {
        crawler.queue({
          uri: school.link,
          // uri: 'https://www.baidu.com',
          callback: (error, res, done) => {
            if (error) {
              console.log(error);
            } else {
              const $ = res.$;
              const infoHtml = $('.working-hours.detail-description');
              school.city = $($(infoHtml).find('.day.clearfix')[0]).find('.hours').text();
              const tableTrHtml = $('.detail-summary > tbody > tr');
              school.isNativeEnglishTeachers = $($(tableTrHtml)[1]).find('td').html() || ''
              school.extraEnglish = $($(tableTrHtml)[2]).find('td').html() || ''
              school.classSizes = {
                average: $($(tableTrHtml)[3]).find('td').text() || '',
                maximum: $($(tableTrHtml)[4]).find('td').text() || '',
              }
              school.extraCurricularActivities = $($(tableTrHtml)[5]).find('td').html() || ''
              school.schoolBus = $($(tableTrHtml)[6]).find('td').html() || ''
              resolve(done());
            }
          }
        });
      })
    }
  }

  return {
    schools: []
  }
})