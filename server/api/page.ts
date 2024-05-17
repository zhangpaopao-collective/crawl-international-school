import * as cheerio from 'cheerio';
import { existsSync, readFileSync  } from "node:fs";
import { resolve, dirname  } from "node:path";

export interface School {
  [key: string]: string | Record<string, string>,
}

export default defineEventHandler(async (event) => {
  const schools: Partial<School>[] = []

   function getMain() {
    const $ = cheerio.load(readFileSync(resolve(dirname('.'), 'schools', 'main.json')));
    
    const schoolNameHtml = $('.card-row-title.school-name');

    schoolNameHtml.each((idx, ele) => {
      const a =  $(ele).find('a')
      if(!schools[idx]) {
        schools[idx] = {};
      }
      schools[idx].name = a.text()
      schools[idx].link = a.attr('href')
    })
  }

  getMain()


  for (let idx = 0; idx < schools.length; idx++) {
    const school = schools[idx];
    if(!existsSync(resolve(dirname('.'), 'schools', `school-${idx}.json`))) {
      continue
    }
    const $ = cheerio.load(readFileSync(resolve(dirname('.'), 'schools', `school-${idx}.json`), 'utf-8'));

    const infoHtml = $('.working-hours.detail-description');
    const infoHtmlItems = $(infoHtml).find('.day.clearfix')
    infoHtmlItems.each((idx, item) => {
      const key = $(item).find('.name').text().trim();
      let value = $(item).find('.hours').text().trim();

      if($(item).find('.hours').find('a').length) {
        value = $(item).find('.hours').find('a').attr('href') || ''
      }
      school[key] = value;
    })

    const panelGroup = $('.panel-group > .panel.panel-default');
    panelGroup.each((idx, item) => {
      const obj: Record<string, string> = {};
      const title = $(item).find('.panel-title').find('a').text().trim();
      const tableTr = $(item).find('.panel-collapse .table  tr')
      tableTr.each((i, tr) => {
        const k = $(tr).find('.question').text().trim();
        const v = $(tr).find('.answer').text().trim();
        obj[k] = v
      })
      school[title] = obj
    })
  }

  return {
    schools
  }
})