const   cheerio = require('cheerio'),
        request = require('request'),
        express = require('express'),
        app     = express();
app.set("view engine", "ejs");

//extract 
const getJobs = (jobsArray)=>{
    request('https://www.indeed.com.ph/mason-jobs', (err, res, html)=>{
        let $= cheerio.load(html);
        let jobs = [];
        if(!err && res){
            $('div.unifiedRow').each((i,el)=>{
                let job={}
                job.title= $(el).find('a.jobtitle').text().replace(/\s+/g, " ");
                job.link= $(el).find('a').attr('href');
                job.company= $(el).find('span.company').text().replace(/\s+/g, " ");
                job.location= $(el).find('span.location').text().replace(/\s+/g, " ");
                job.summary= $(el).find('div.summary').text().replace(/\s+/g, " ");
                jobs.push(job);
                jobsArray(jobs);
                //return jobsArray;
            });
        }
    });
}

app.get('/search/:job', (req, res)=>{
    res.render('search');
});

app.listen(3000, ()=>{
    console.log('App has started!');
});
