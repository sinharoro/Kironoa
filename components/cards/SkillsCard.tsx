'use client'

import { motion } from 'framer-motion'

interface Skill {
  name: string
  value: number
}

const skills: Skill[] = [
  { name: 'React', value: 90 },
  { name: 'TypeScript', value: 85 },
  { name: 'Node.js', value: 75 },
  { name: 'CSS', value: 95 },
  { name: 'Design', value: 70 },
  { name: 'API', value: 80 },
]

const radarPoints = (centerX: number, centerY: number, radius: number, sides: number, angleOffset: number) => {
  const points: string[] = []
  for (let i = 0; i < sides; i++) {
    const angle = (angleOffset * Math.PI) / 180 + (i * 2 * Math.PI) / sides
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }
  return points.join(' ')
}

const generateGrid = (centerX: number, centerY: number, radius: number) => {
  const grids = []
  for (let i = 1; i <= 4; i++) {
    const r = (radius * i) / 4
    grids.push(
      <polygon
        key={i}
        points={radarPoints(centerX, centerY, r, 6, -90)}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />
    )
  }
  return grids
}

export default function SkillsCard() {
  const centerX = 100
  const centerY = 100
  const radius = 80

  const dataPoints = radarPoints(centerX, centerY, radius, 6, -90)

  const skillAngles = skills.map((_, i) => {
    const angle = (-90 * Math.PI) / 180 + (i * 2 * Math.PI) / 6
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return (
    <div className="glass-card p-6 sm:p-8 flex flex-col">
      <h3 className="font-semibold mb-4">Skills Radar</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
          {generateGrid(centerX, centerY, radius)}
          
          <polygon
            points={dataPoints}
            fill="rgba(192, 86, 33, 0.3)"
            stroke="#C05621"
            strokeWidth="2"
          />
          
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={skillAngles[i].x}
              y2={skillAngles[i].y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          ))}
          
          {skills.map((skill, i) => (
            <motion.g key={skill.name}>
              <circle
                cx={skillAngles[i].x}
                cy={skillAngles[i].y}
                r="4"
                fill="#C05621"
              />
              <motion.text
                x={skillAngles[i].x}
                y={skillAngles[i].y + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="9"
                fontFamily="'DM Mono', monospace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {skill.name}
              </motion.text>
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  )
}