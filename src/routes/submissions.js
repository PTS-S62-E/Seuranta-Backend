import express from 'express';

import {Submission} from '../models/Submission'
import {
    submissionAcceptedToQueue,
    submissionDeclinedToQueue
} from "../middleware/submissionToQueue";

let router = express.Router();

router.get('/', function (req, res) {
    const query = req.query.search;

    if (query) {
        Submission.find({
            message: {
                $regex: query,
                $options: 'i'
            }
        })
            .sort('-createdAt')
            .exec(function (error, submissions) {
                if (error) {
                    res.status(500).json({
                        'message': 'An error occurred while retrieving the submission',
                        'error': error
                    });
                }

                res.json(submissions);
            });
    } else {
        Submission.find({})
            .sort('-createdAt')
            .exec(function (error, submissions) {
                if (error) {
                    res.status(500).json({
                        'message': 'An error occurred while retrieving the submission',
                        'error': error
                    });
                }

                res.json(submissions);
            });
    }
});


router.post('/:id/approve', submissionAcceptedToQueue);
router.post('/:id/decline', submissionDeclinedToQueue);

router.get('/:id', function (req, res) {
    Submission
        .findById(req.params.id)
        .exec(function (error, submission) {
            if (error) {
                res.status(500).json({
                    'message': 'An error occurred while retrieving the submission',
                    'error': error
                });
            }

            res.json(submission);
        });
});

router.delete('/:id', function (req, res) {
    Submission.findByIdAndRemove(req.params.id,
        function (error, submission) {
            if (error) {
                res.status(500).json(error);
            }

            res.json(submission);
        });
});

export default router;