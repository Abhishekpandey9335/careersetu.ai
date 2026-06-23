import React from 'react';
import './Lectures.css';

const lectures = [
  {
    id: 'aIN70uEcD2M',
    title: '793. Preimage Size of Factorial Zeroes Function',
    tags: ['BinaryTree', 'LeetCode', 'Java', 'DSA', 'CodingInterview'],
  },
  {
    id: 'klR0ayltYnU',
    title: 'Binary Tree in 1 Shot',
    tags: ['BinaryTree', 'LeetCode', 'Java', 'DSA', 'CodingInterview'],
  },
  {
    id: '5Uz3d-cVX_E',
    title: '1004. Max Consecutive Ones III',
    tags: ['JavaProgramming', 'JavaCodingInterview', 'CoreJava', 'JavaDSA'],
  },
  {
    id: 'fUB0heQmTh0',
    title: '204. Count Primes',
    tags: ['LeetCode', 'LeetCode204', 'CountPrimes', 'Java', 'DSA'],
  },
  {
    id: 'oZElL3JYqLw',
    title: '128. Longest Consecutive Sequence',
    tags: ['LeetCode', 'LeetCode128', 'LongestConsecutiveSequence', 'Java', 'DSA'],
  },
  {
    id: 'KIzu3Ig6-AU',
    title: '203. Remove Linked List Elements',
    tags: ['Java', 'JavaArrays', 'DSA', 'ArraysInJava', 'LeetCode'],
  },
  {
    id: '25JC2RIEFYY',
    title: 'Array in One Shot',
    tags: ['Java', 'JavaArrays', 'DSA', 'ArraysInJava', 'LeetCode'],
  },
  {
    id: 'T1FCLF8EHdc',
    title: '334. Increasing Triplet Subsequence',
    tags: ['LeetCode', 'LeetCode334', 'DSA', 'JavaProgramming', 'CodingInterview', 'MediumLevel'],
  },
  {
    id: '9QJtEuaki1w',
    title: 'Java in One Shot',
    tags: ['Coding', 'LeetCode', 'Java', 'DSA'],
  },
];

const Lectures = () => {
  const openVideo = (id) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="lectures-page">
      <div className="lectures-header">
        <h1>Free DSA & Java Lectures</h1>
        <p>Hand-picked YouTube lectures to master DSA, Java & Coding Interviews</p>
      </div>

      <div className="lectures-grid">
        {lectures.map((lec) => (
          <div
            key={lec.id}
            className="lecture-card"
            onClick={() => openVideo(lec.id)}
          >
            <div className="lecture-thumb-wrap">
              <img
                src={`https://img.youtube.com/vi/${lec.id}/hqdefault.jpg`}
                alt={lec.title}
                className="lecture-thumb"
                loading="lazy"
              />
              <div className="play-overlay">▶</div>
            </div>
            <div className="lecture-info">
              <h3 className="lecture-title">{lec.title}</h3>
              <div className="lecture-tags">
                {lec.tags.slice(0, 4).map((tag) => (
                  <span className="lecture-tag" key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lectures;