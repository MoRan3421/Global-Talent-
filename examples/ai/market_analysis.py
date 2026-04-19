import torch
import torch.nn as nn

class TransformerModel(nn.Module):
    """Extreme High Performance AI Model for Global Talent Marketplace Analysis"""
    def __init__(self, vocab_size, d_model, nhead):
        super().__init__()
        self.encoder = nn.Embedding(vocab_size, d_model)
        self.transformer = nn.Transformer(d_model, nhead)
        self.decoder = nn.Linear(d_model, vocab_size)

    def forward(self, x):
        return self.decoder(self.transformer(self.encoder(x)))
