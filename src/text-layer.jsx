import React from "react";
import parseHtml from "./html-parser";
import Annotations from "./annotations";


const HIGHLIGHT_CLASSNAME = "hi-text-highlight";

class TextLayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rootNode: parseHtml(this.props.data.text), highlightedAnnotation: null};
	}

	componentWillReceiveProps(newProps) {
		this.setState({rootNode: parseHtml(newProps.data.text), highlightedAnnotation: null});
	}

	unHighlightAnnotation() {
		this.setState({highlightedAnnotation: null});
	}

	highlightAnnotation(annotation) {
		this.setState({highlightedAnnotation: annotation});
	}

	renderNode(node, i) {
		let className = node.activeAnnotations.indexOf(this.state.highlightedAnnotation) > -1 ?
			HIGHLIGHT_CLASSNAME :
			null;
		if(node.textContent) {
			return <span  className={className || ""} key={i}>{node.textContent}</span>
		} else {
			switch(node.tagName) {
				case "sup":
					if(node.attributes['data-id']) {
						return (
							<sup key={i}>
								<a href={"#" + node.attributes['data-id']}
									onMouseOut={this.unHighlightAnnotation.bind(this)}
									onMouseOver={this.highlightAnnotation.bind(this, node.attributes['data-id'])}>
									{node.children.map(this.renderNode.bind(this))}
								</a>
							</sup>
						);
					} else {
						return <sup key={i}>{node.children.map(this.renderNode.bind(this))}</sup>;
					}
				case "i":
					return <i key={i}>{node.children.map(this.renderNode.bind(this))}</i>;
				case "b":
					return <b key={i}>{node.children.map(this.renderNode.bind(this))}</b>;
				case "u":
					return <u key={i}>{node.children.map(this.renderNode.bind(this))}</u>;
				case "br":
					return <br key={i} />;
				default:
					return <span key={i}>{node.children.map(this.renderNode.bind(this))}</span>;

			}
		}
	}

	render() {
		let annotations = this.props.data.annotationData && this.props.data.annotationData.length > 0 ? 
			(<Annotations data={this.props.data.annotationData} highlighted={this.state.highlightedAnnotation} onNavigation={this.props.onNavigation} />) :
			"";

		return (
			<div>
				<h2>{this.props.label}</h2>
				<div>
					{this.state.rootNode.children.map(this.renderNode.bind(this)) }
				</div>
				{annotations}
			</div>
		);
	}
}

TextLayer.propTypes = {
	data: React.PropTypes.object,
	label: React.PropTypes.string,
	onNavigation: React.PropTypes.func
};

TextLayer.defaultProps = {
	onNavigation: null
};

export default TextLayer;