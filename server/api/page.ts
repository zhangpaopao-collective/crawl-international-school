import * as cheerio from 'cheerio';
import { existsSync, readFileSync  } from "node:fs";
import { resolve, dirname  } from "node:path";

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
  const schools: Partial<School>[] = []

  function getMain() {
    const $ = cheerio.load(readFileSync(resolve(dirname('.'), 'schools', 'main.json')), );
    // console.log(readFileSync(resolve(dirname('.'), 'schools', 'main.json'), 'utf-8'));
    
    const schoolNameHtml = $('span.icon-bar');

    console.log(schoolNameHtml);

    // schoolNameHtml.each((idx, ele) => {
    //   const a =  $(ele).find('a')
    //   if(!schools[idx]) {
    //     schools[idx] = {};
    //   }
    //   schools[idx].name = a.text()
    //   schools[idx].link = a.attr('href')
    // })
  
    // const schoolBasicInfoHtml = $('.card-row-properties > dl');
  
    // schoolBasicInfoHtml.each((idx, ele) => {
    //   const dd = $(ele).find('dd')
    //   const dt = $(ele).find('dt')
    //   if(!schools[idx]) {
    //     schools[idx] = {};
    //   }
  
    //   schools[idx].curriculum = $(dt[0]).text()
    //   schools[idx].language = $(dt[1]).text()
    //   schools[idx].ages = $(dt[2]).text();
    //   const currency = $(dt[3]).find('.currency');
    //   if(currency) {
    //     schools[idx].fees = [$(currency[0]).text(), $(currency[1]).text()];
    //   }
    // })
  }

  getMain()


  // for (let idx = 0; idx < schools.length; idx++) {
  //   const school = schools[idx];
  //   const $ = cheerio.load(readFileSync(resolve(dirname('.'), 'schools', `school-${idx}.json`), 'utf-8'));
  //   const infoHtml = $('.working-hours.detail-description');
  //   school.city = $($(infoHtml).find('.day.clearfix')[0]).find('.hours').text();
  //   const tableTrHtml = $('.detail-summary > tbody > tr');
  //   school.isNativeEnglishTeachers = $($(tableTrHtml)[1]).find('td').html() || ''
  //   school.extraEnglish = $($(tableTrHtml)[2]).find('td').html() || ''
  //   school.classSizes = {
  //     average: $($(tableTrHtml)[3]).find('td').text() || '',
  //     maximum: $($(tableTrHtml)[4]).find('td').text() || '',
  //   }
  //   school.extraCurricularActivities = $($(tableTrHtml)[5]).find('td').html() || ''
  //   school.schoolBus = $($(tableTrHtml)[6]).find('td').html() || ''
  // }

  return {
    schools
  }
})