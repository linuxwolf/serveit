/**
 * @copyright 2023 Matthew A. Miller
 */

import { describe, it } from "std/testing/bdd.ts";
import { expect } from "expecto/mod/index.ts";

import { decode, encode } from "./hex.ts";

describe("util/hex", () => {
  const vectors = [
    {
      name: "basic short data",
      encoded: "00010203",
      decoded: new Uint8Array([ 0, 1, 2, 3 ]),
    },
    {
      name: "basic long data",
      encoded: "000102030405060708090a0b0c0d0e0f",
      decoded: new Uint8Array([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ]),
    },
    {
      name: "empty data",
      encoded: "",
      decoded: new Uint8Array(0),
    },
    {
      name: "same bytes",
      encoded: "a3a3a3",
      decoded: new Uint8Array([163, 163, 163]),
    },
  ];
  describe("encode", () => {
    for (const v of vectors) {
      it(`encodes Uint8Array of ${v.name}`, () => {
        const result = encode(v.decoded);
        expect(result).to.equal(v.encoded);
      });
      it(`encodes Uint8ClampedArray of ${v.name}`, () => {
        const data = new Uint8ClampedArray(v.decoded);
        const result = encode(data);
        expect(result).to.equal(v.encoded);
      });
      it(`encodes ArrayBuffer of ${v.name}`, () => {
        const data = v.decoded.buffer;
        const result = encode(data);
        expect(result).to.equal(v.encoded);
      });
    }
  });
  describe("decode()", () => {
    for (const v of vectors) {
      it(`decodes ${v.name}`, () => {
        const result = decode(v.encoded);
        expect(result).to.deep.equal(v.decoded);
      });
    }

    it("throws if odd-length string", () => {
      const fn = () => decode("01020");
      expect(fn).to.throw(Error).with.property("message").to.equal("invalid input size");
    });
    it("throws if invalid hex values", () => {
      const fn = () => decode("oops");
      expect(fn).to.throw(Error).with.property("message").to.equal("invalid input string");
    });
  });
});
