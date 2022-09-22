# FrenchVocabLearner-WebApp-Svelte: 

Learn French vocabulary with this application!

## 1. App Features
This web app currently includes the following features to help you learn French vocabulary:
<ol>
    <li>Account based authentication to save your progress</li>
    <li>A database of over <em>118,000</em> words with definitions and parts of speech</li>
    <li>A dictionary where you can query the database to see the above features for any word, and save it to your account</li>
    <li>A learning mode where the application provides 10 random words from the database with definitions and parts of speech</li>
    <li>Personalized quizzes based on words you've already encountered to enforce your knowledge</li>
    <li>A progress page where you can see each word you've learned along with a rating to enforce how well you know each word</li>
</ol>

<br>

## 2. Technologies Used

<ol>
    <li><b>Backend: Node.js (Express) + Typescript</b></li>
    <p>I chose to use Typescript for this project since I've not used it before and wanted to see why it is so highly rated. From this point, Node.js and express seemed like a logical choice for the backend server.</p>
    <br>
    <li><b>Database: MySQL (MariaDB) + Sequelize Client</b></li>
    <p>I considered using MongoDB for this project, but ultimately chose MariaDB due to my familiarity with table based schemas. Sequelize provided a great way to connect to my database and perform queries using Typescript, so it made sense to use as well. A copy of my database can be found at the root level of this repository in <em>VocabLearnerFR.mysql</em></p>
    <br>
    <li><b>Frontend: Svelte + Typescript</b></li>
    <p>Svelte is a lightweight frontend framework that was brought to my attention at the start of July 2022, so I decided to try it out. I likely didn't use SvelteKit (the more "frameworky" set of tools offered) to the fullest extent, but Svelte was a pleasure to use and would strongly consider using it for future projects.</p>
    <br>
    <li><b>Sessions: Cookies + Redis</b></li>
    <p>There are many ways to implement sessions, and I ultimately chose to use cookies since this project was initially intended to be hosted. I needed some way to save session data, and chose to use Redis since it was the most downloaded store option available and was highly rated.</p>
    <br>
    <li><b>Testing: Jest</b></li>
    <p>I thought testing would be relatively straightforward for this application, but I've never had to test a live DB with dependency injection before, so although writing this program without a test suite is bad practice, I will be adding a suite of tests over time to learn how these things work.</p>
    <br>
</ol>

## 3. Instructions

If you want to use the application, you're going to need:
<ol>
    <li>Access to a MariaDB server</li>
    <li>A Redis server to store session data</li>
    <li>A way to run a node.js server</li>
    <li>A way to run a vite server for Svelte</li>
</ol> 

<b>There is a lot of setup required, so I've added a short demonstration of the app's features at the end of this Readme if you want to see the features before using it.</b>

### 1. Installations

Go to both <em>/Server</em> and <em>/frontend</em> and enter <b>npm install</b> (or yarn equivalent) in the terminal in each of those directories to install all of the required packages

### 2. Database

<ol>
    <li>Create a MariaDB database using the mysqldump file <em>/VocabLearnerFR.mysql</em> on your MariaDB server</li>
    <li>To connect a MariaDB database to the application, simply fill in the details in <em>/server/.env</em> for DB_USERNAME, DB_PASSWORD, and DB_NAME.</li>
</ol>

### 3. Redis

Make sure that a Redis server is running locally at port 6379 on your machine and it should be set up after performing all of the installations. If this doesn't seem to work, feel free to contact me and I can help troubleshoot the problem.

### 4. Node.js Server

Go to <em>/Server</em> and enter <b>npm run start</b> after installing dependencies.

### 5. Svelte Vite Server

Go to <em>/frontend</em> and enter <b>npm run dev</b> after installing dependencies. Follow the instructions prompted by the terminal to access the web interface.

<br>

## 4. Coming Soon

There are some features I've worked toward visible in the source code, but are not available yet. They are:

<ol>
    <li>Learning from curated lists of the top 200 most common French nouns, verbs, etc.</li>
    <li>Taking quizzes on the content from bullet point 1.</li>
    <li>Guarateeing that you are learning from a set of words you've not encountered before. This is currently very unlikely, but will be necessary for the content from bullet point 1.</li>
</ol>

<br>

## 5. Feature Demonstration Video

See a demonstration of all the features this app has to offer <a href="https://www.youtube.com/watch?v=etTEzO52VCk">Video Coming Soon</a>.
