const   cheerio = require('cheerio'),
        request = require('request'),
        express = require('express'),
        app     = express();
app.set("view engine", "ejs");

// print 
// const printJob = (job)=>{
//     Object.keys(job).forEach(function (item) {
//         console.log(`${item} : ${job[item]}`); 
//     });
//     console.log('\n');
// }

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
            });
        }
        jobsArray(jobs);
    });
}

getJobs((jobs)=>{
    console.log(jobs);
})

//print all
// getJobs((jobs)=>{
//     jobs.forEach(job =>printJob(job));
// });


//Routes
app.get('/search/:job', (req, res)=>{
    res.render('search', {getJobs:getJobs});
});

app.listen(3000, ()=>{
    console.log('App has started!');
});