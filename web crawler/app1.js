const   bodyParser= require('body-parser'),
        cheerio = require('cheerio'),
        request = require('request'),
        express = require('express'),
        app     = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

//extract 
let jobs;
let search;
const getJobs = (search, (jobsArray)=>{
    jobs=[];
    request('https://www.indeed.com.ph/'+search+'-jobs', (err, res, html)=>{
        let $= cheerio.load(html);
        if(!err && res){
            $('div.unifiedRow').each((i,el)=>{
                let job={};
                job.title= $(el).find('a.jobtitle').text().replace(/\s+/g, " ");
                job.link= $(el).find('a').attr('href');
                job.company= $(el).find('span.company').text().replace(/\s+/g, " ");
                job.location= $(el).find('span.location').text().replace(/\s+/g, " ");
                job.summary= $(el).find('div.summary').text().replace(/\s+/g, " ");
                jobs.push(job);
            });
        }
        jobsArray(jobs);
    });
});

app.get('/', (req, res)=>{
    res.render('job');
});

app.post('/search', (req, res)=>{
    //job=[];
    search = req.params.job;
    res.redirect('/search/'+req.body.jobSearch);
});

app.get('/search/:job', (req, res)=>{
    search = req.params.job;
    getJobs((jobs)=>{
        console.log(jobs, jobs.length);
        res.render('search', {jobs:jobs});
    });
});

app.listen(3000, ()=>{
    console.log('App has started!');
});