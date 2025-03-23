import React from 'react'
import { Popover } from 'react-bootstrap'
import OverlayTrigger, { type OverlayTriggerRenderProps } from 'react-bootstrap/OverlayTrigger'
import { useItem } from '../../artifactsmmo-client/hooks/use-item'
import type { components } from '../../artifactsmmo-client/spec'

interface ItemTooltipProps extends OverlayTriggerRenderProps {
  item: components['schemas']['ItemSchema'] | null
}

const renderTooltip = ({ item, ...tooltipProps }: ItemTooltipProps) => {
  return (
    <Popover {...tooltipProps}>
      <Popover.Header>{item?.name}</Popover.Header>
      <Popover.Body>
        <pre>{JSON.stringify(item, null, 2)}</pre>
      </Popover.Body>
    </Popover>
  )
}

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  code: string
}

const ItemImg = ({ code, height = 25, ...imgProps }: Props) => {
  const item = useItem(code)

  return (
    <OverlayTrigger
      placement="auto"
      delay={{ show: 250, hide: 400 }}
      overlay={(props) => {
        return renderTooltip({ item, ...props })
      }}
    >
      <img {...imgProps} src={`https://artifactsmmo.com/images/items/${code}.png`} alt={code} height={height} />
    </OverlayTrigger>
  )
}

export { ItemImg }
