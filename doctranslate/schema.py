from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Span(BaseModel):
    text: str
    bold: bool = False
    italic: bool = False
    underline: bool = False
    font_size: Optional[float] = None
    font_name: Optional[str] = None
    color: Optional[str] = None
    translated_text: Optional[str] = None  # Populated after translating inline spans if needed

class DocumentBlock(BaseModel):
    id: str
    type: str  # 'paragraph', 'heading', 'list_item', 'table', 'image', 'code_block', 'equation'
    content: str  # Raw text representation of the block
    translated_content: Optional[str] = None
    spans: List[Span] = Field(default_factory=list)
    attributes: Dict[str, Any] = Field(default_factory=dict)
    # For tables: list of rows, each containing list of cells, each cell contains a list of DocumentBlocks
    table_rows: Optional[List[List[List['DocumentBlock']]]] = None

    class Config:
        arbitrary_types_allowed = True

# Resolve forward references for nested structures like table_rows
DocumentBlock.model_rebuild()

class UnifiedDocument(BaseModel):
    metadata: Dict[str, Any] = Field(default_factory=dict)
    blocks: List[DocumentBlock] = Field(default_factory=list)
