## Inspiration


Have you been frustrated waiting in long queue just to get 5 minutes with a recruiter of your dream company or angry seeing people cutting line in front you? Well, I have. During the last Spring Viterbi Career Fair, I planned to meet at least reps from 5 different companies. But because of the constant line cutting and the exhausting long queue, I was only able to talk to 2 reps. This made me wonder, “is it worth standing in long lines during career fair?” And when I discussed this issue with my newly met friends in this hackathon, we came up with the solution – FairEasy!

## What it does


The system is basically a queuing and notification system that assigns numbers to participants and notify them when they are next in queue. A student gets a QR code when he/she registers with FairEasy. He/she can scan this QR code to be en-queued in a recruiter's list and would be notified when he/she is close to his/her turn.

## How we built it


We used PostgreSQL as the backend database and Node.Js as the backend server.The front end is designed using bootstrap and Angular.JS, which transfers information to the backend that generates QR codes using QRcodeJS for the student.For the recruiter, we are using Instascan to scan the QR codes and include them in a list that is stored and updated in the database.

## Challenges we ran into


Incorporating QR codes,updating the Queuing system in real time.


## Accomplishments that we're proud of


The fact the system would help so many of our fellow trojans meet more recruiters in a meaningful way during the career fairs.

## What we learned


How we can very easily incorporate QR codes in our application.

## What's next for FairEasy


Allow students to upload resume and pitch
Personalize company recommendations based on student profile
Adding comments section for recruiter
Replacing QR code with face detection

## Built With


node.js
angular.js
bootstrap
postgresql
