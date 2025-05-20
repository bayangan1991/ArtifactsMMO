import React from 'react'
import { Placeholder } from 'react-bootstrap'
import { useCharacterEffect } from '../../artifactsmmo-client/hooks/use-character-effect.ts'

interface Props {
  code: string
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
}

const CharacterEffect = ({ code, imgProps = { height: 25 } }: Props) => {
  const { data: effect } = useCharacterEffect({ code })

  if (!effect)
    return (
      <div className="d-inline-block">
        <Placeholder as="span">{code}</Placeholder>
      </div>
    )

  return (
    <div className="d-inline-block" title={effect.description}>
      <img {...imgProps} src={`https://artifactsmmo.com/images/effects/${code}.png`} alt={code} />
      <span className="ms-2">{effect.name}</span>
    </div>
  )
}

export { CharacterEffect }
