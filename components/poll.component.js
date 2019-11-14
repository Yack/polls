import React, { useState, useEffect } from 'react'
import { Progress, Button } from '@weekday/elements'
import moment from 'moment'

export default function PollComponent(props) {
  const [complete, setComplete] = useState(false)
  const [total, setTotal] = useState(0)
  const [highest, setHighest] = useState(0)
  const [expired, setExpired] = useState(0)

  const updatePoll = async () => {
    console.log('Updating')
  }

  const deletePoll = async () => {
    if (confirm("Are you sure?")) {
      console.log('Deleting')
    } else {
      console.log('Not deleting')
    }
  }

  const answerQuestion = async (questionId) => {
    console.log(questionId)
    setComplete(true)
  }

  useEffect(() => {
    let answerCountHighest = 0

    props.questions.map(question => {
      // See if this user has completed the poll
      props.answers.map(answer => {
        if (answer.user_id == props.currentUserId) setComplete(true)
      })

      // Set the score for the highest amount of votes
      answerCountHighest = props.answers.filter(answer => answer.question_id == question.id).length
    })

    setTotal(props.answers.length)
    setHighest(answerCountHighest)
    setExpired(moment(props.expiry).isBefore(moment()))
  }, [])

  return (
    <React.Fragment>
      <style jsx>{`
        .poll-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          align-content: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .poll-inner {
          flex: 1;
          flex-direction: column;
          display: flex;
          align-items: center;
          align-content: center;
          justify-content: center;
        }

        .progress-container {
          margin-bottom: 5px;
          width: 100%;
        }
      `}</style>

      <div className="poll-container">
        <div className="poll-inner">
          <div className="h4 color-d3 text-left w-100 mb-0">{props.title}</div>
          <div className="h5 color-d0 text-left w-100 mb-10">{props.description}</div>

          {!complete && !expired &&
            <React.Fragment>
              {props.questions.map((question, index) => {
                return (
                  <div className="progress-container" key={index}>
                    <Button
                      text={question.text}
                      theme="blue-border"
                      size="full-width"
                      style={{ height: 35 }}
                      onClick={() => answerQuestion(question.id)}
                    />
                  </div>
                )
              })}
            </React.Fragment>
          }

          {(complete || expired) &&
            <React.Fragment>
              {props.questions.map((question, index) => {
                const answers = props.answers.filter(answer => answer.question_id == question.id)
                const percentage = Math.floor((answers.length / total) * 100)
                const color = answers.length >= highest ? '#e9edf2' : '#f0f2f5'

                return (
                  <div className="progress-container" key={index}>
                    <Progress
                      percentage={percentage}
                      color={color}
                      text={question.text}
                      labels={true}
                    />
                  </div>
                )
              })}
            </React.Fragment>
          }

          <div className="p color-d1 text-left w-100 mt-5">
            {expired &&
              <span>This poll expired {moment(props.expiry).fromNow()}</span>
            }
            {!expired &&
              <span>This poll expires at {moment(props.expiry).format('LL')}</span>
            }
            {props.currentUserId == props.userId &&
              <strong className="button ml-10 color-blue" onClick={updatePoll}>Update</strong>
            }
            {props.currentUserId == props.userId &&
              <strong className="button ml-10 color-red" onClick={deletePoll}>Delete</strong>
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}